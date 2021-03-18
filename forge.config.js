module.exports = {
  packagerConfig: {
    icon: "assets/card.ico",
    name: "身份证阅读器"
  },
  "makers": [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        // setupExe: "身份证阅读器安装包.exe",
        // name: "idCardReader",
        authors: "yuanwen0327@outlook.com",
        noDelta: true
        // "iconUrl": "assets/card.ico"
      }
    }
  ]
}