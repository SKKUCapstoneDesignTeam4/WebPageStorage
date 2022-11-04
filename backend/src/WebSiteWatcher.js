import * as cheerio from "cheerio";
import axios from "axios";
import * as utility from "./Utility.js"
import moment from "moment"

import { logger } from "./Logger.js";

export class WebSiteWatcher
{
    core;
    siteInfo;
    isBusy = false;
    failedNum = 0;
    intervalId;

    constructor(core, siteInfo)
    {
        this.core = core;
        this.siteInfo = siteInfo;
    }

    start()
    {
        this.checkImmediately();
    }

    stop()
    {
        if(this.intervalId) {
            clearTimeout(this.intervalId);
        }
    }

    checkImmediately()
    {
        this._runInternal();

        const nextTimeSec = 3600; // 1 hour
        this.intervalId = setTimeout(this._runInternal.bind(this), nextTimeSec * 1000);
    }

    getSiteId()
    {
        return this.siteInfo.id;
    }

    _runInternal()
    {
        if(this.isBusy) return;

        this._checkNewPage().then(() => {
            this.failedNum = 0;
        }).catch((e) => {
            logger.error(`WebSiteWatcher: Failed to check a new page. (${e.name}: ${e.message})\n        Site id: ${this.siteInfo.id}(${this.siteInfo.title})\n        ${e.stack}`);

            this.failedNum += 1;
            if(this.failedNum >= 10) {
                logger.error(`WebSiteWatcher: Failed to check a new page 10 times continuously, so disable this web site.\n        Site id: ${this.siteInfo.id}(${this.siteInfo.title})`);
                logger.error('WebSiteWatcher: Check the logs for fixing errors and enable it manually, or delete it.');
                // this.core.updateWebSite(this.siteInfo._id, { isDisabled: true });
            }
        });
    }

    async _checkNewPage()
    {
        this.isBusy = true;

        let res = await axios.get(this.siteInfo.crawlUrl);


        const $ = cheerio.load(res.data);
        const aElement = $(this.siteInfo.cssSelector)[0];

        const pageUrl = utility.relToAbsUrl(aElement.attribs.href, this.siteInfo.url);

        if(this.siteInfo.lastUrl != pageUrl) {
            this._savePage(pageUrl);
        }

        this.isBusy = false;
    }

    async _savePage(pageUrl)
    {
        const pageInfo = await utility.getPageInfo(pageUrl);
        pageInfo.siteId = this.siteInfo.id;
        pageInfo.ownerUserId = this.siteInfo.ownerUserId;

        await this.core.insertPage(pageInfo);

        this.siteInfo.lastUrl = pageUrl;
    }
}
