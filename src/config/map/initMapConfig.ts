import jsapLoader from '@amap/amap-jsapi-loader'
export const initMapConfig = (mapPlugins?: string[], mapUiPlugins?: string[]) => {
  return new Promise((reslove, reject) => {
    jsapLoader
      .load({
        key: 'dd0195de63c296c5988319b62601fe92',
        plugins: mapPlugins,
        version: '2.0',
        AMapUI: {
          plugins: mapUiPlugins,
          version: '1.1',
        },
        Loca: {
          version: '2.0.0',
        },
      })
      .then(aMap => {
        reslove(aMap)
      })
      .catch(err => {
        reject(err)
      })
  })
}
