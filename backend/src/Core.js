import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import sharp from "sharp";

import { DB } from "./DB.js";
import { logger } from "./Logger.js";
import { WebSiteWatcher } from "./WebSiteWatcher.js";
import { WebPageWatcher } from "./WebPageWatcher.js";
import { rimrafPromise, relToAbsUrl } from "./Utility.js";
import { InvalidRequestError } from "./Error.js";

export class Core
{
    watchers = []
    pageWatchers = []

    constructor()
    {
    }
    
    async initialize()
    {
        // load watchers from DB
        const infos = await DB.getWebSites(-1);

        infos.forEach((info) => {
            this.watchers.push(new WebSiteWatcher(this, info));
        });

        const pages = await DB.getPages(-1);
        pages.forEach((page) => {
            this.pageWatchers.push(new WebPageWatcher(this, page));
        })
    }

    run()
    {
        this.watchers.forEach(function(w){
            w.start();
        });
        this.pageWatchers.forEach(function(w){
            w.start();
        });

        logger.info(`Started Core.\n      (Num of watchers: ${this.watchers.length} / Num of page watchers: ${this.pageWatchers.length})`);
    }

    // Register 
    async register(userInfo)
    {
        const userId = await DB.getUserInfo(userInfo.name);
        if(userId !== undefined) {
            throw new InvalidRequestError("ID already existed", 400);
        }

        const res = await DB.insertUserInfo(userInfo);
        if(res == -1) {
            throw new InvalidRequestError("ID already existed", 400);
        }
        return res;
    }

    async checkRegistered(userInfo)
    {
        const dbUserInfo = await DB.getUserInfo(userInfo.name);
        if(dbUserInfo && userInfo.password === dbUserInfo.password) return dbUserInfo.id;
        else return undefined;
    }

    async removeUser(name)
    {
        await DB.deleteUserInfo(await DB.getUserInfo(name).id);   
    }

    async updateUser(userInfo)
    {
        await DB.updateUserInfo(await DB.getUserInfo(userInfo).id, userInfo);   
    }

    // Website watcher interactions ==================

    async getWebSites(userId)
    {
        return await DB.getWebSites(userId);
    }

    async addWebSite(info)
    {
        try{
            await this.verifySite(info);

            const resId = await DB.insertWebSite(info);
            info.id = resId;

            const watcher = new WebSiteWatcher(this, info);
            watcher.start();
            this.watchers.push(watcher);

            logger.info(`Core: Inserted a web site.\n        id: ${info.id} / title: ${info.title} / url: ${info.url}`);
        }
        catch(e){
            throw e;
        }
    }

    async removeWebSite(userId, id, deleteAllPages)
    {
        const deleteNum = await DB.deleteWebSite(userId, id, deleteAllPages);

        if(deleteNum != 0) {
            const index = this.watchers.findIndex(function(e){
                return e.getSiteId() == id;
            });

            if(index == -1) {
                throw Error(`Core: Cannot find deleted web site in the watchers.\n        Site id: ${id}`);
            }
            this.watchers[index].stop();
            this.watchers.splice(index, 1);

            logger.info(`Core: Deleted the web site.\n        id: ${id}`);
        } else {
            throw new InvalidRequestError(`Site not found (id: ${id})`, 404);
        }
    }

    async updateWebSite(userId, id, params)
    {
        const res = await DB.updateWebSite(userId, id, params);

        if(res > 0) {
            const index = this.watchers.findIndex(function(e){
                return e.getSiteId() == id;
            });

            if(index == -1) {
                throw Error(`Core: Cannot find deleted web site in the watchers.\n        Site id: ${id}`);
            }
            this.watchers[index].stop();
            this.watchers.splice(index, 1);

            const updatedInfo = await DB.getWebSite(userId, id);
            const watcher = new WebSiteWatcher(this, updatedInfo);
            watcher.start();
            this.watchers.push(watcher);

            logger.info(`Core: Updated the web site.\n        id: ${id} / params: ${JSON.stringify(params)}`);
        } else if(res == 0) {
            throw new InvalidRequestError(`Site not found (id: ${id})`, 404);
        } else if(res == -1) {
            // Do nothing
        }
    }

    async getPages(userId, params)
    {
        return DB.getPages(userId, params);
    }

    async insertPage(info)
    {
        const resId = await DB.insertPage(info);
        info.id = resId;

        let newThumbnailPath;
        try {
            newThumbnailPath = await this.saveThumbnail(info.ownerUserId, info.id, info.thumbnailUrl);
        } catch (e) {
            newThumbnailPath = "";
        }
        info.thumbnailUrl = newThumbnailPath;

        await Promise.all([
            DB.updatePage(info.ownerUserId, info.id, { thumbnailUrl: newThumbnailPath }),
            DB.updateWebSite(info.ownerUserId, info.siteId, { lastUrl: info.url })
        ]);

        const watcher = new WebPageWatcher(this, info);
        watcher.start();
        this.pageWatchers.push(watcher);

        logger.info(`Core: Added a new page. (Site id: ${info.siteId})\n        id: ${info.id} / title: ${info.title}`);
    }

    async removePage(userId, id, withThumbnail = true)
    {
        const res = await DB.deletePage(userId, id);

        if(res == 0) {
            throw new InvalidRequestError("Page not found", 404);
        }

        if(withThumbnail) {
            try {
              await fs.promises.unlink(`static_data/${userId}/thumbnails/${id}.png`)
            } catch(e) {
                logger.warn(`Core: Failed to delete the page data.\n        id: ${id}\n        ${e}`);
            }
        }

        if(res > 0) {
            const index = this.pageWatchers.findIndex(function(e) {
                return e.getPageId() == id;
            });

            if(index == -1) {
                logger.warn(`Core: Cannot find the page in page wachter.\n        id: ${id}\n`);
            } else {
                this.pageWatchers[idx].stop();
                this.pageWatchers.splice(index, 1);
            }

            await DB.deleteAllPageBody(id);

            logger.info(`Core: Deleted the page.\n        id: ${id}`);
        }
    }

    async readPage(userId, id, setUnread)
    {
        const res = await DB.updatePage(userId, id, { isRead: setUnread ? 0 : 1 });
        if(res == 0) {
            throw new InvalidRequestError("Page not found", 404);
        } else if(res == -1) {
            // Do nothing
        }
    }

    async updatePage(userId, id, params)
    {
        const res = await DB.updatePage(userId, id, params);

        if(res > 0) {
            const index = this.pageWatchers.findIndex(function(e) {
                return e.getPageId() == id;
            });

            if(index == -1) {
                logger.warn(`Core: Cannot find web page in the page watchers.\n        Page id: ${id}`)
            } else {
                this.pageWatchers[index].stop();
                this.watchers.splice(index, 1);

                const updatedInfo = await DB.getPage(userId, id);
                const wathcer = new WebPageWatcher(this, updatedInfo);
                // wathcer.start();
                watcher.checkImmediately(true);
                this.pageWatchers.push(wathcer);

            }

            logger.info(`Core: Web page is updated.\n        id: ${id} / params: ${JSON.stringify(params)}`);
        } else {
            logger.warn(`Core: Try to update the web page, but nothing changed.\n        id: ${id} / params: ${JSON.stringify(params)}`);
        }
    }

    forceRefresh()
    {
        this.watchers.forEach((w) => {
            w.checkImmediately();
        });
        this.pageWatchers.forEach((w) => {
            w.checkImmediately();
        });
    }

    //==============================================

    async verifySite(webSiteInfo)
    {
        let res = await axios.get(webSiteInfo.crawlUrl);

        const $ = cheerio.load(res.data);
        const aElement = $(webSiteInfo.cssSelector)[0];

        const pageUrl = relToAbsUrl(aElement.attribs.href, webSiteInfo.url);
    }

    async saveThumbnail(userId, pageId, url)
    {
        if(url == "") {
            return "";
        }
    
        const localDirPath = `static_data/${userId}/thumbnails/`;
        if(fs.existsSync(localDirPath) == false) {
            await fs.promises.mkdir(localDirPath, { recursive: true });
        }

        const localPath = localDirPath + `${pageId}.png`;

        const thumbnailData = await axios.get(url, { responseType: 'arraybuffer' });
        await sharp(thumbnailData.data).resize(400, null, { withoutEnlargement: true }).png().toFile(localPath);
        
        return localPath;
    }
}
