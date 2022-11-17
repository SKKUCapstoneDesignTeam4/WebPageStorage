import * as cheerio from "cheerio";
import axios from "axios";
import moment from "moment"

import { logger } from "./Logger.js";

export class WebPageWatcher
{
    core;
    pageInfo;
    isBusy = false;
    failedNum = 0;
    intervalId;

    constructor(core, pageInfo)
    {
        this.core = core;
        this.pageInfo = pageInfo;
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
        if(this.intervalId) {
            clearTimeout(this.intervalId);
        }

        this._runInternal();

        const nextTimeSec = 3600; // 1 hour
        this.intervalId = setTimeout(this._runInternal.bind(this), nextTimeSec * 1000);
    }

    getPageId()
    {
        return this.pageInfo.id;
    }

    _runInternal()
    {
        if(this.isBusy) return;

        this._checkPage().then(() => {
            this.failedNum = 0;
        }).catch((e) => {
            this.failedNum += 1;
            if(this.failedNum >= 3) {
                this.core.updatePage(this.pageInfo.ownerUserId, this.pageInfo.id, { isDeleted: true });
            }
        });
    }

    async _checkPage()
    {
        this.isBusy = true;
        if(this.pageInfo.isDeleted === 0) {
            let res = await axios.get(this.pageInfo.url);
            const $ = cheerio.load(res.data);

            const body = $('body').html();
        }

        this.isBusy = false;
    }
}
