import axios from "axios";
import * as cheerio from "cheerio";
import moment from "moment"

export function relToAbsUrl(url, baseUrl)
{
    const absRegex = /^(?:[a-z]+:)?\/\//i;

    if(absRegex.test(url) == true) {
        return url;
    } else {
        const u = new URL(url, baseUrl);
        return u.toString();
    }
}

export async function getPageInfo(pageUrl)
{
    let res = await axios.get(pageUrl);

    const $ = cheerio.load(res.data);
    let selected;

    let title = "";
    selected = $('meta[property="og:title"]');
    if(selected.length != 0) {
        title = selected[0].attribs.content;
    } else {
        selected = $('title');
        if(selected.length != 0) {
            title = selected.text();
        }
    }

    let url = "";
    selected = $('meta[property="og:url"]');
    if(selected.length != 0) {
        url = selected[0].attribs.content;
    } else {
        url = pageUrl;
    }

    let thumbnailUrl = "";
    selected = $('meta[property="og:image"]');
    if(selected.length != 0) {
        thumbnailUrl = selected[0].attribs.content;
    } else {
        selected = $('meta[property="og:image:secure_url"]');
        if(selected.length != 0) {
            thumbnailUrl = selected[0].attribs.content;
        }
    }

    let desc = "";
    selected = $('meta[property="og:description"]');
    if(selected.length != 0) {
        desc = selected[0].attribs.content;
    }

    const page = {
        id: "",
        title: title,
        url: url,
        thumbnailUrl: thumbnailUrl,
        desc: desc,
        time: moment().toDate(),
        isRead: false,
        siteId: "",
        OwnerUserId: ""
    };
    return page;
}
