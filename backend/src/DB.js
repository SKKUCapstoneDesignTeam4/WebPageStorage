import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import SQL from 'sql-template-strings';

import { logger } from "./Logger.js";

function toCamelCase(dbRes)
{
    if(!dbRes) return dbRes;

    let res = {};
    for(let [k, v] of Object.entries(dbRes)) {
        k = k.replace(/(_[A-Za-z])/g, function(word, index) {
            return word[1].toUpperCase();
        });
        res[k] = v;
    }
    return res;
}

class DB
{
    async init(fileName, useVerbose = false)
    {
        if(useVerbose) {
            sqlite3.verbose();
        }

        if(fileName == undefined) {
            fileName = "db.db"
        }

        this.db = await sqlite.open({ filename: fileName, driver: sqlite3.Database });

        this.initDBSchema();

        logger.info(`Successfully load DB. (${fileName})`);
    }

    async initDBSchema()
    {
        await Promise.all([
            this.db.exec("CREATE TABLE IF NOT EXISTS user_info (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)"),
            this.db.exec("CREATE TABLE IF NOT EXISTS web_site_info (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, crawl_url TEXT, css_selector TEXT, last_url TEXT, owner_user_id INTEGER)"),
            this.db.exec("CREATE TABLE IF NOT EXISTS web_page_info (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, url TEXT, thumbnail_url TEXT, desc TEXT, time TEXT, is_read INTEGER, site_id INTEGER, owner_user_id INTEGER)"),
            this.db.exec("CREATE TABLE IF NOT EXISTS web_page_body_info (id INTEGER PRIMARY KEY AUTOINCREMENT, page_id INTEGER, time TEXT, body TEXT)")
        ]);

        // Add additional column
        {
            // web_page_info
            const columnInfos = await this.db.all(`PRAGMA table_info(web_page_info)`);

            if(columnInfos.find((e) => e.name === "is_updated") === undefined) {
                await this.db.exec("ALTER TABLE web_page_info ADD COLUMN is_updated INTEGER DEFAULT 0");
            }
            if(columnInfos.find((e) => e.name === "is_deleted") === undefined) {
                await this.db.exec("ALTER TABLE web_page_info ADD COLUMN is_deleted INTEGER DEFAULT 0");
            }
            if(columnInfos.find((e) => e.name === "is_bookmarked") === undefined) {
                await this.db.exec("ALTER TABLE web_page_info ADD COLUMN is_bookmarked INTEGER DEFAULT 0");
            }
        }
    }

    async shutdown()
    {
        await this.db.close();
    }

    async getUserInfo(name)
    {
        const res = await this.db.get(SQL`SELECT * FROM user_info WHERE name=${name}`);
        return toCamelCase(res);
    }

    async insertUserInfo(userInfo)
    {
        try {
            const res = await this.db.run(SQL`INSERT INTO user_info (name, password) VALUES (${userInfo.name}, ${userInfo.password})`);
            return res.lastID;
        } catch(e) {
            if(e.code === "SQLITE_CONSTRAINT") {
                return -1; // name already existed
            } else {
                throw e;
            }
        }
    }

    async deleteUserInfo(id)
    {
        const res = await this.db.run(SQL`DELETE FROM user_info WHERE id=${id}`);
        return res.changes;
    }

    async updateUserInfo(id, params)
    {
        if(!id) return;

        let paramString = []
        if(params.name) paramString.push(`name='${params.name}'`);
        if(params.password) paramString.push(`password='${params.password}'`);

        if(paramString.length > 0) {
            await this.db.run(
                SQL`UPDATE user_info SET `
                .append(paramString.join(","))
                .append(SQL` WHERE id=${id}`));
        }
    }

    async getWebSites(userId)
    {
        let query = SQL`SELECT * FROM web_site_info`;
        if(userId != -1) query.append(SQL` WHERE owner_user_id=${userId}`);

        const res = await this.db.all(query);

        return res.map(function(e){ return toCamelCase(e) });
    }

    async getWebSite(userId, id)
    {
        let query = SQL`SELECT * from web_site_info WHERE id=${id}`;
        if(userId != -1) query.append(SQL` AND owner_user_id=${userId}`);
        const res = await this.db.get(query);

        return toCamelCase(res);
    }

    async insertWebSite(webSiteInfo)
    {
        let query = SQL`INSERT INTO web_site_info (title, url, crawl_url, css_selector, last_url, owner_user_id) `;
        query.append(SQL`VALUES (${webSiteInfo.title}, ${webSiteInfo.url}, ${webSiteInfo.crawlUrl}, ${webSiteInfo.cssSelector},
                                 ${webSiteInfo.lastUrl}, ${webSiteInfo.ownerUserId})`);

        const res = await this.db.run(query);
        return res.lastID;
    }

    async deleteWebSite(userId, id, deleteAllPages = false)
    {
        let query = SQL`DELETE FROM web_site_info WHERE id=${id}`;
        if(userId != -1) query.append(SQL` AND owner_user_id=${userId}`);
        const res = await this.db.run(query);

        if(deleteAllPages) {
            let query2 = SQL`DELETE FROM web_page_info WHERE site_id=${id}`;
            if(userId != -1) query2.append(SQL` AND owner_user_id=${userId}`);
            await this.db.run(query2);
        }

        return res.changes;
    }

    async updateWebSite(userId, id, params)
    {
        if(!id) return;

        let paramString = [];
        if(params.title !== undefined) paramString.push(`title="${params.title}"`);
        if(params.url !== undefined) paramString.push(`url="${params.url}"`);
        if(params.crawlUrl !== undefined) paramString.push(`crawl_url="${params.crawlUrl}"`);
        if(params.cssSelector !== undefined) paramString.push(`css_selector="${params.cssSelector}"`);
        if(params.lastUrl !== undefined) paramString.push(`last_url="${params.lastUrl}"`);
        if(params.ownerUserId !== undefined) paramString.push(`owner_user_id=${params.ownerUserId}`);

        if(paramString.length > 0) {
            let query = SQL`UPDATE web_site_info SET `
                             .append(paramString.join(","))
                             .append(SQL` WHERE id=${id}`);
            if(userId != -1) query.append(SQL` AND owner_user_id=${userId}`);

            const res = await this.db.run(query);
            return res.changes;
        } else {
            return -1;
        }
    }

    // Pages?????? ????????? parmas
    //   * afterId
    //   * count
    async getPages(userId, params)
    {
        let query = SQL`SELECT * FROM web_page_info WHERE owner_user_id=${userId}`;
        if(userId == -1) {
            query = SQL`SELECT * FROM web_page_info`;
        } else {
            if(params.afterId) {
                query.append(SQL` AND id < ${params.afterId}`);
            }
            query.append(SQL` ORDER BY id DESC`);
            if(params.count) {
                query.append(SQL` LIMIT ${params.count}`);
            }
        }

        const res = await this.db.all(query);
        return res.map(function(e){ return toCamelCase(e) });
    }

    async getPage(userId, id)
    {
        let query = SQL`SELECT * from web_page_info WHERE id=${id}`;
        if(userId != -1) query.append(SQL` AND owner_user_id=${userId}`);
        const res = await this.db.get(query);

        return toCamelCase(res);
    }

    async getBookmarkedPages(userId, params)
    {
        let query = SQL`SELECT * FROM web_page_info WHERE owner_user_id=${userId} AND is_bookmarked=1`;
        if(userId == -1) {
            query = SQL`SELECT * FROM web_page_info WHERE is_bookmarked=1`;
        } else {
            if(params.afterId) {
                query.append(SQL` AND id < ${params.afterId}`);
            }
            query.append(SQL` ORDER BY id DESC`);
            if(params.count) {
                query.append(SQL` LIMIT ${params.count}`);
            }
        }

        const res = await this.db.all(query);
        return res.map(function(e){ return toCamelCase(e) });
    }

    async insertPage(webPageInfo)
    {
        let query = SQL`INSERT INTO web_page_info (title, url, thumbnail_url, desc, time, is_read, is_bookmarked, site_id, owner_user_id) `;
        query.append(SQL`VALUES (${webPageInfo.title}, ${webPageInfo.url}, ${webPageInfo.thumbnailUrl}, ${webPageInfo.desc},
                                 ${webPageInfo.time}, ${webPageInfo.isRead}, ${webPageInfo.isBookmarked} , ${webPageInfo.siteId}, ${webPageInfo.ownerUserId})`);

        const res = await this.db.run(query);
        return res.lastID;
    }

    async deletePage(userId, id)
    {
        let query = SQL`DELETE FROM web_page_info WHERE id=${id}`;
        if(userId != -1) query.append(SQL` AND owner_user_id=${userId}`);

        const res = await this.db.run(query);
        return res.changes;
    }

    async updatePage(userId, id, params)
    {
        if(!id) return;

        let paramString = [];
        if(params.title !== undefined) paramString.push(`title="${params.title}"`);
        if(params.url !== undefined) paramString.push(`url="${params.url}"`);
        if(params.thumbnailUrl !== undefined) paramString.push(`thumbnail_url="${params.thumbnailUrl}"`);
        if(params.desc !== undefined) paramString.push(`desc="${params.desc}"`);
        if(params.time !== undefined) paramString.push(`time="${params.time}"`);
        if(params.isRead !== undefined) paramString.push(`is_read=${params.isRead}`);
        if(params.isBookmarked !== undefined) paramString.push(`is_bookmarked=${params.isBookmarked}`);
        if(params.siteId !== undefined) paramString.push(`site_id=${params.siteId}`);
        if(params.ownerUserId !== undefined) paramString.push(`owner_user_id=${params.ownerUserId}`);
        if(params.isUpdated !== undefined) paramString.push(`is_updated=${params.isUpdated}`);
        if(params.isDeleted !== undefined) paramString.push(`is_deleted=${params.isDeleted}`);

        if(paramString.length > 0) {
            let query = SQL`UPDATE web_page_info SET `
                          .append(paramString.join(","))
                          .append(SQL` WHERE id=${id}`);
            if(userId != -1) query.append(SQL` AND owner_user_id=${userId}`);

            const res = await this.db.run(query);
            return res.changes;
        } else {
            return -1;
        }
    }

    async getLastPageBody(pageId)
    {
        let query = SQL`SELECT * from web_page_body_info WHERE page_id=${pageId}`;
        query.append(SQL` ORDER BY id DESC LIMIT 1`);
        const res = await this.db.get(query);

        return toCamelCase(res);
    }

    async insertPageBody(pageBodyInfo)
    {
        let query = SQL`INSERT INTO web_page_body_info (page_id, time, body) `;
        query.append(SQL`VALUES (${pageBodyInfo.pageId}, ${pageBodyInfo.time}, ${pageBodyInfo.body})`);

        const res = await this.db.run(query);
        return res.lastID;
    }

    async deletePageBody(id)
    {
        let query = SQL`DELETE FROM web_page_body_info WHERE id=${id}`;

        const res = await this.db.run(query);
        return res.changes;
    }

    async deleteAllPageBody(pageId)
    {
        let query = SQL`DELETE FROM web_page_body_info WHERE page_id=${pageId}`;

        const res = await this.db.run(query);
        return res.changes;
    }
}

const db = new DB()
export { db as DB }
