
import PortalChannel from '../../channels/portal';
import util from '../../utils/util';

const portalChannel = new PortalChannel();
export default class RegionPicker {
    constructor(page) {
        this.page = page;
        this.regionData = [];
        this.data = {
            provinceData: [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }],
            cityData: [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }],
            areaData: [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }],
            provinceId: 0,
            cityId: 0,
            areaId: 0,
            provinceName: '',
            cityName: '',
            areaName: '',
            animationMenu: null,
            menuIsShow: false,
            checkRegion: false,
            selectValue: []
        }
    }
    load(provinceId, cityId, areaId) {
        portalChannel.getRegionData().then(data => {
            this.regionData = data;
            const provinceData = this.findRegionData(-1);
            const cityData = this.findRegionData(provinceId);
            const areaData = this.findRegionData(cityId);

            const province = this.findRegion(provinceData, provinceId);
            const city = this.findRegion(cityData, cityId);
            const area = this.findRegion(areaData, areaId);

            this.setData({
                provinceId,
                cityId,
                areaId,
                provinceData,
                cityData,
                areaData,
                provinceName: province.name,
                cityName: city.name,
                areaName: area.name,
                selectValue: [province.index, city.index, area.index]
            });

            this.sureRegion();
        });
    }
    setData(obj2) {
        this.data = Object.assign({}, this.data, obj2);

        const { areaData, cityId, areaId } = this.data;
        if (areaData.length > 1) {
            this.data.checkRegion = areaId > 0;
        }
        else {
            this.data.checkRegion = cityId > 0;
        }

        if (this.page.setRegionData) {
            this.page.setRegionData(this.data);
        }
    }
    changeRegion(value) {
        let provinceNum = value[0];
        let cityNum = value[1];
        let areaNum = value[2];

        let provinceItem = this.data.provinceData[provinceNum];
        let cityItem = this.data.cityData[cityNum];
        let areaItem = this.data.areaData[areaNum];

        const cityData = this.findRegionData(provinceItem.region_id);
        const areaData = this.findRegionData(cityItem.region_id);

        this.setData({
            selectValue: value,
            provinceId: provinceItem.region_id,
            cityId: cityItem.region_id,
            areaId: areaItem.region_id,
            provinceName: provinceItem.region_name,
            cityName: cityItem.region_name,
            areaName: areaItem.region_name,
            cityData,
            areaData
        });
    }
    findRegionData(parentRegionId) {
        let regionData = [{ 'region_id': 0, 'region_name': encodeURIComponent('请选择') }];
        for (let region of this.regionData) {
            if (region.region_id === parentRegionId) {
                regionData = regionData.concat(region.region_list);
                break;
            }
        }
        return regionData;
    }
    findRegion(regionData, regionId) {
        if (regionId === 0) {
            return '';
        }
        let regionIndex = 0;
        let region;
        regionData.some((item, index) => {
            if (item.region_id === regionId) {
                region = item;
                regionIndex = index;
                return true;
            }
        });
        return region ? { name: region.region_name, index: regionIndex } : { name: '', index: 0 };
    }
    startAnimation(isShow) {
        const animation = wx.createAnimation({ duration: 500, timingFunction: 'ease', });
        if (isShow) {
            animation.translateY(0 + 'vh').step();
        } else {
            animation.translateY(40 + 'vh').step();
        }

        this.setData({
            animationMenu: animation.export(),
            menuIsShow: isShow,
        })
    }
    cancelRegion() {
        this.startAnimation(false);
    }
    // 点击地区选择确定按钮
    sureRegion() {
        const { provinceId, cityId, areaId, provinceName, cityName, areaName } = this.data;
        this.startAnimation(false);
        // 将选择的城市信息显示到输入框
        if (this.page.sureRegion) {
            let regionName = '';
            let regionId = 0;
            if (provinceId > 0) {
                regionName += provinceName + ' ';
            }
            if (cityId > 0) {
                regionName += cityName + ' ';
                regionId = cityId;
            }
            if (areaId > 0) {
                regionName += areaName + ' ';
                regionId = areaId;
            }
            this.page.sureRegion(regionId, regionName);
        };
    }
    selectRegion() {
        // 如果已经显示，不在执行显示动画
        if (this.data.menuIsShow) {
            return;
        }
        this.startAnimation(true)
    }
}