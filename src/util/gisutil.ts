import proj4 from 'proj4';

export class GISUtil {
    public static tileLonLatMap = new Map<string, [number, number]>();

    public static tileUTMMap = new Map<string, [number, number]>();

    static {
        for (let zone = 1; zone <= 60; zone++) {
            const zoneStr = zone.toString().padStart(2, '0');
            const epsg = `EPSG:326${zoneStr}`;
            proj4.defs(epsg, `+proj=utm +zone=${zoneStr} +datum=WGS84 +units=m +no_defs`);
        }
    }

    /**
     * 经纬度转 UTM
     */
    public static wgs84ToUTM(lonLat: [number, number]): [number, number] {
        const zone: number = GISUtil.wgs84ToUTMZone(lonLat);
        const zoneStr = zone.toString().padStart(2, '0');
        // const epsg: string = `EPSG:32630`;
        const epsg: string = `EPSG:326${zoneStr}`;
        return proj4('WGS84', epsg, lonLat);
    }

    /**
     * 经纬度转 UTM 带号
     */
    public static wgs84ToUTMZone(lonLat: [number, number]): number {
        const lon = lonLat[0];
        const lat = lonLat[1];
        const zone = Math.floor(((lon + 180) % 360) / 6) + 1;
        if (lat >= 56.0 && lat < 64.0 && lon >= 3.0 && lon < 12.0) {
            return 32;
        }
        if (lat >= 72.0 && lat < 84.0) {
            if (lon >= 0.0 && lon < 9.0) {
                return 31;
            }
            if (lon >= 9.0 && lon < 21.0) {
                return 33;
            }
            if (lon >= 21.0 && lon < 33.0) {
                return 35;
            }
            if (lon >= 33.0 && lon < 42.0) {
                return 37;
            }
        }
        return zone;
    }

    /**
     * 瓦片坐标转经纬度
     */
    public static tileToLonLat(x: number, y: number, z: number): [number, number] {
        let lonLat = GISUtil.tileLonLatMap.get(`${x}-${y}-${z}`);
        if (!lonLat) {
            const n = Math.PI - (2.0 * Math.PI * y) / Math.pow(2.0, z);
            lonLat = [(x / Math.pow(2.0, z)) * 360.0 - 180.0, (180.0 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))];
            GISUtil.tileLonLatMap.set(`${x}-${y}-${z}`, lonLat);
        }
        return lonLat;
    }

    /**
     * 经纬度转瓦片坐标
     */
    public static lonLatToTile(lonLat: [number, number], z: number): [number, number] {
        const x = Math.floor(((lonLat[0] + 180) / 360) * Math.pow(2, z));
        const y = Math.floor(
            ((1 - Math.log(Math.tan((lonLat[1] * Math.PI) / 180) + 1 / Math.cos((lonLat[1] * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, z)
        );
        return [x, y];
    }

    /**
     * 瓦片坐标转 UTM
     */
    public static tileToUTM(x: number, y: number, z: number): [number, number] {
        let utm = GISUtil.tileUTMMap.get(`${x}-${y}-${z}`);
        if (!utm) {
            const lonLat = GISUtil.tileToLonLat(x, y, z);
            utm = GISUtil.wgs84ToUTM(lonLat);
            GISUtil.tileUTMMap.set(`${x}-${y}-${z}`, utm);
        }
        return utm;
    }

    /**
     * 获取当前时间的时分秒
     */
    public static getHMS() {
        const date = new Date();
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
}
