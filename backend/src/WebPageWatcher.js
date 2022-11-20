import * as cheerio from "cheerio";
import axios from "axios";
import moment from "moment"

import { logger } from "./Logger.js";
import { DB } from "./DB.js"

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
        // Delay checking when initialized
        // because of preventing checking many pages at same time
        const delayTimeSec = Math.random() * 3600; // 1 hour
        this.intervalId = setTimeout(this.checkImmediately.bind(this), delayTimeSec * 1000);
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
                this.core.updatePage(this.pageInfo.ownerUserId, this.pageInfo.id, { isDeleted: 1 });
            }
        });
    }

    async _checkPage()
    {
        this.isBusy = true;

        let timeGapMin = moment().toDate() - Date.parse(this.pageInfo.time);
        timeGapMin /= 1000 * 60;

        if(this.pageInfo.isDeleted === 0 && timeGapMin < 5 * 24 * 60 /*5 days*/) {
            let res = await axios.get(this.pageInfo.url);
            const $ = cheerio.load(res.data);

            const body = $('body').html();

            let updated = true;
            const dbRes = await DB.getLastPageBody(this.pageInfo.id);
            if(dbRes) {
                if(body === dbRes.body) {
                    updated = false;
                }
            }

            if(updated) {
                Promise.all([
                    DB.insertPageBody({
                        pageId: this.pageInfo.id,
                        time: moment().toDate().toISOString(),
                        body: body
                    }),
                    this.core.updatePage(this.pageInfo.ownerUserId, this.pageInfo.id, { isUpdated: 1 })
                ]);
            }
        }

        this.isBusy = false;
    }
}
