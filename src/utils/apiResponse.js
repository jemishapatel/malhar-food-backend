class ApiResponse {
  /**
   * @param {boolean} success - Flag indicating operation state
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Descriptive response message
   * @param {any} [data=null] - Payload content (for successful responses)
   * @param {any} [errors=null] - Error breakdown detail array/object (for failures)
   */
  constructor(success, statusCode, message, data = null, errors = null) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) this.data = data;
    if (errors !== null) this.errors = errors;
  }

  static success(res, statusCode = 200, message = "Success", data = null) {
    return res.status(statusCode).json(
      new ApiResponse(true, statusCode, message, data)
    );
  }

  static error(res, statusCode = 400, message = "Error occurred", errors = null) {
    return res.status(statusCode).json(
      new ApiResponse(false, statusCode, message, null, errors)
    );
  }
}

module.exports = ApiResponse;
