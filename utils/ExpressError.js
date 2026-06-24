class ExpressError extends Error {
    constructor(statusCode,mesage){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

}

module.exports = ExpressError;