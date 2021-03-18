const sdk = require('./sdk')


module.exports = {
    io: null,
    init(port) {
        const httpServer = require("http").createServer();
        this.io = require("socket.io")(httpServer, {
            cors: {
                origin: "*",
            }
        })
        this.io.on("connection", socket => {
            /**
             * 客户端发起读卡请求后，使设备处于持续扫描状态
             *      - 轮询判断卡是否在机器上
             *      - 在机器上后立即读卡
             *      - 15次机会，每次2秒
             */
            let timer = null
            socket.on("scanCard", () => {
                console.log("scanCard");
                clearTimeout(timer)
                let count = 15
                poll()
                // timer = null
                function poll() {
                    if(count <= 0){
                        clearTimeout(timer)
                        timer = null
                        return
                    }
                    timer = setTimeout(() => {
                        // sdk.cardOn()
                        sdk.auth()
                        if (sdk.cardOn()) {
                            clearTimeout(timer)
                            timer = null

                            const data = sdk.read()
                            socket.emit("cardData", data);
                        }else{
                            count--
                            console.log(`还剩${count}次机会`)
                            poll() 
                        }
                    }, 2000)
                }


            });
        });

        httpServer.listen(port);
    },
    close() {
        socket.close()
    }
}



