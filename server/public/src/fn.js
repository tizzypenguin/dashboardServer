class Fn {
    constructor() {
        this.rubbish = {};

        function filterSite (siteRows, no_site) {
            for(let site of siteRows) {
                if(site.no == no_site) {
                    return site;
                }
            }
        };
        
        function filterMaster (masterRows, no_master) {
            for(let master of masterRows) {
                if(master.no == no_master) {
                    return master;
                }
            }
        }

        this.rubbish.settingList = function (siteRows, masterRows, detailRows) {
            let returnArr = [];
            // console.log(siteRows, masterRows, detailRows);
            for(let detail of detailRows) {
                let master = filterMaster(masterRows, detail.no_master);
                if(!master) {
                    continue;
                }
                if((master.arr||'') != '') {
                    master.arr.push(detail);
                } else {
                    master.arr = [];
                    master.arr.push(detail);
                }
            }
            for(let master of masterRows) {
                let site = filterSite(siteRows, master.no_site);
                if(!site) {
                    continue;
                }
                if((site.arr||'') != '') {
                    site.arr.push(master);
                } else {
                    site.arr = [];
                    site.arr.push(master);
                }
            }
            for(let site of siteRows) {
                returnArr.push(site);
            }
            return returnArr;
        }
    }
}

module.exports = new Fn()