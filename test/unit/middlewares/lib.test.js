// TODO: TEST ALL MIDDLEWARES IN LIB FOLDER
const formatTime = require("../../../lib/formatTime");
const SignToken = require("../../../lib/signToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const resetTokens = require("../../../lib/ResetTokens");
const asyncWrapper = require("../../../lib/asyncWrapper");
const formParser = require("../../../lib/formParser");
const hashPassword = require("../../../lib/hashPassword");

describe("Test all functions in the lib folder", () => {
  describe("Test all functions that are not middlewares", () => {
    const req = jest.fn();
    const res = jest.fn();
    const next = jest.fn((err) => err.message);

    it("should return a string formated date and time", async () => {
      const date = new Date(Date.now());
      const currentTime = date.toTimeString();
      const currentDate = date.toDateString();
      const result = await formatTime(date);

      expect(result).toMatchObject({ day: currentDate, time: currentTime });
      expect(result).toHaveProperty("day", currentDate);
      expect(result).toHaveProperty("time", currentTime);
    });

    it("should return a valid signed jwt", () => {
      let id = 1;
      let secret = "testSecret";
      let expiresIn = "5d";
      const token = SignToken.SignJwtFunc(jwt, id, secret, expiresIn);
      expect(jwt.decode(token)).toMatchObject({ id: 1 });
      expect(token).not.toBeUndefined();
    });
    describe("SignToken.decode", () => {
      it("should decode a valid jwt", async () => {
        let id = "1";
        let secret = "testSecret";
        const token = jwt.sign(id, secret);
        let decodedToken = await SignToken.decode(token, secret, jwt);

        expect(decodedToken).not.toBeUndefined();
        expect(decodedToken).toEqual(id);
      });

      it("should reject with an error if invalid jwt is passed", async () => {
        let invalidToken = "invalidToken";
        let secret = "invalidSecret";
        await expect(
          SignToken.decode(invalidToken, secret, jwt)
        ).rejects.toBeInstanceOf(jwt.JsonWebTokenError);
      });
    });

    describe("generate Token", () => {
      let randomString = "randomStringsreturned";
      let crypto = {
        randomBytes: jest.fn((byteLength, callback) => {
          return callback(null, randomString);
        }),
      };
      it("should generate a 32 randombytes string ", async () => {
        let randomBytes = await resetTokens.generateToken(crypto);
        expect(randomBytes).not.toBeUndefined();
        expect(randomBytes).not.toBeNull();
        expect(randomBytes).toEqual(randomString);
      });

      it("should throw reject with an error if crypto fails", () => {
        let errorMessage = "Crypto generation Failed";
        let crypto = {
          randomBytes: jest.fn((byteLength, callback) => {
            return callback(new Error(errorMessage));
          }),
        };
        expect(resetTokens.generateToken(crypto)).rejects.toEqual(
          Error(errorMessage)
        );
      });
    });
    it("should hash data passed to it using crypto", async () => {
      let data = "1";
      let salt = 10;
      let hashedData = await resetTokens.hashData(data, bcrypt, salt);
      expect(hashedData).not.toBeNull();
      expect(hashedData).not.toBeUndefined();
    });

    it("should create a link with passed variables", async () => {
      let clientUrl = "http://sampleurl.com";
      let tokenObject = {
        userId: "1",
      };
      let unHashedToken = "randombytesofString";
      let link = `${clientUrl}/reset-page?token=${unHashedToken}&id=${tokenObject.userId}`;

      let result = await resetTokens.createResetLink(
        unHashedToken,
        tokenObject,
        clientUrl
      );

      expect(result).toEqual(link);
    });

    it("should return a function ", () => {
      let handlerFunction = () => {};
      let returnedFunction = asyncWrapper(handlerFunction);
      expect(returnedFunction).toBeInstanceOf(Function);
    });

    it("should execute passed function", async () => {
      let handlerFunction = jest.fn();
      let returnedFunction = asyncWrapper(handlerFunction);
      await returnedFunction();
      expect(handlerFunction).toHaveBeenCalled();
    });

    it("should pass caught error to the next handler", async () => {
      let errorMessage = "An error Occured";
      let handlerFunction = jest.fn(() => {
        throw new Error(errorMessage);
      });
      let returnedFunction = asyncWrapper(handlerFunction);
      await returnedFunction(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next).toHaveReturnedWith(errorMessage);
    });
  });

  describe("Test all middlewares that do not interact with DB", () => {
    describe("Form parser", () => {
      const formidable = require("formidable");
      const ApiError = {
        incorrectCredentials: jest.fn(),
      };
      const returnedValue = formParser(formidable, ApiError);
      let next = jest.fn();
      const res = null;
      let req = {};

      it("should return a middleware function", () => {
        expect(returnedValue).not.toBeNull();
        expect(returnedValue).toBeInstanceOf(Function);
      });
      it("should call the next handler with custom ApiError object on error", () => {
        let next = jest.fn();
        returnedValue(req, res, next);
        expect(next).toHaveBeenCalledWith(ApiError.incorrectCredentials());
        expect(ApiError.incorrectCredentials).toHaveBeenCalled();
      });
      it("should call the next handler if no error is detected", () => {
        req = {
          headers: {
            "content-length": 10,
            "content-type": "multipart/form-data",
          },
          on: jest.fn,
        };
        returnedValue(req, res, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe("hash password", () => {
      let req = {
        body: {
          other: "others",
        },
      };
      let res = {};
      let bcrypt = {
        hash: jest.fn(),
      };
      let ApiError = {
        incorrectCredentials: jest.fn(),
      };
      let next = jest.fn();
      afterEach(() => {
        jest.clearAllMocks();
      });
      it("should return a middleware function", () => {
        let bcrypt;
        let ApiError;
        let returnedMiddleware = hashPassword(bcrypt, ApiError);
        expect(returnedMiddleware).toBeInstanceOf(Function);
      });

      it("should call next with custom ApiError if password and email is absent", () => {
        errorMessage = "Details missing, check and try again";
        let bcrypt;
        let returnedMiddleware = hashPassword(bcrypt, ApiError);
        returnedMiddleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(ApiError.incorrectCredentials());
        expect(ApiError.incorrectCredentials).toHaveBeenCalled();
        expect(ApiError.incorrectCredentials).toHaveBeenCalledWith(
          errorMessage
        );
      });

      it("should call bcrpt hash to hash password ", () => {
        let samplePassword = "samplePassword";
        let sampleEmail = "sampleEmail";
        req.body.password = samplePassword;
        req.body.email = sampleEmail;
        let returnedMiddleware = hashPassword(bcrypt, ApiError);
        returnedMiddleware(req, res, next);
        expect(bcrypt.hash).toHaveBeenCalled();
      });
      it("should call next with an Error if error occurs during hashing", () => {
        let intentionalError = new Error("Intentional Error");
        let bcrypt = {
          hash: jest.fn((password, salt, callback) => {
            return callback(intentionalError);
          }),
        };
        let samplePassword = "samplePassword";
        let sampleEmail = "sampleEmail";
        req.body.password = samplePassword;
        req.body.email = sampleEmail;
        let returnedMiddleware = hashPassword(bcrypt, ApiError);
        returnedMiddleware(req, res, next);
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(intentionalError);
      });
      it("should set request body.password to hashed and call next", () => {
        let hashedPassword = "newlyHashedPassword";
        let bcrypt = {
          hash: jest.fn((password, salt, callback) => {
            return callback(null, hashedPassword);
          }),
        };
        let samplePassword = "samplePassword";
        let sampleEmail = "sampleEmail";
        req.body.password = samplePassword;
        req.body.email = sampleEmail;
        let returnedMiddleware = hashPassword(bcrypt, ApiError);
        returnedMiddleware(req, res, next);
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(req.body.password).toEqual(hashedPassword);
        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("reset password", () => {
      describe("verify Token", () => {
        let token = {
          token: "sampleToken",
        };
        let clientToken = "sampleToken";
        let next = jest.fn();
        let bcrypt = {
          compare: jest.fn((clientToken, token, callback) => {
            return callback(null, token === clientToken);
          }),
        };
        let ApiError = {
          unAuthorized: jest.fn(),
        };

        afterEach(() => {
          jest.clearAllMocks();
        });

        const { VerifyToken } = require("../../../lib/ResetPassword");
        it("should return a promise ", () => {
          const returnedPromise = VerifyToken(
            token,
            clientToken,
            next,
            bcrypt,
            ApiError
          );
          expect(returnedPromise).toBeInstanceOf(Promise);
        });

        it("should call next with custom error if token is false", async () => {
          let token;
          const returnedPromise = VerifyToken(
            token,
            clientToken,
            next,
            bcrypt,
            ApiError
          );
          expect(next).toHaveBeenCalled();
          expect(next).toHaveBeenCalledWith(ApiError.unAuthorized());
        });

        it("should reject with an error if bcrypt compare fails", () => {
          let token = {
            token: "sampleToken",
          };
          let bcrypt = {
            compare: jest.fn((clientToken, token, callback) => {
              return callback(new TypeError());
            }),
          };
          expect(
            VerifyToken(token, clientToken, next, bcrypt, ApiError)
          ).rejects.toBeInstanceOf(TypeError);
        });
        it("should resolve a false validity if received tokens do not match", () => {
          let clientToken = "notSampleToken";
          expect(
            VerifyToken(token, clientToken, next, bcrypt, ApiError)
          ).resolves.toEqual(false);
        });

        it("should resolve a true validity if received tokens match", () => {
          expect(
            VerifyToken(token, clientToken, next, bcrypt, ApiError)
          ).resolves.toEqual(true);
        });
      });

      describe("hash new password", () => {
        const { HashNewPassword } = require("../../../lib/ResetPassword");
        let password;
        let isValid;
        let hashedPasswordResult = "hashedPassword";
        let bcrypt = {
          hash: jest.fn((password, salt = 10, callback) => {
            return callback(null, hashedPasswordResult);
          }),
        };
        let customErrorMessage = "Intentional Error";
        let ApiError = {
          unAuthorized: jest.fn(() => new Error(customErrorMessage)),
        };
        let next = jest.fn();
        let params = [password, isValid, next, bcrypt, ApiError];
        afterEach(() => {
          jest.clearAllMocks();
        });
        it("should return a promise", () => {
          let returnedValue = HashNewPassword(...params);
          expect(returnedValue).toBeInstanceOf(Promise);
        });
        it("should call next with custom ApiError unauthorized method if invalid token", () => {
          let returnedValue = HashNewPassword(...params);
          expect(next).toHaveBeenCalled();
          expect(next).toHaveBeenCalledWith(Error(customErrorMessage));
        });
        it("should reject with an error if bcrypt hash fails", () => {
          let bcrypt = {
            hash: jest.fn((password, salt = 10, callback) => {
              return callback(new Error(customErrorMessage));
            }),
          };
          let params = ["clientPassword", true, next, bcrypt, ApiError];
          expect(HashNewPassword(...params)).rejects.toEqual(
            Error(customErrorMessage)
          );
        });

        it("should return hashed function if bcrypt hash passed", () => {
          let params = ["clientPassword", true, next, bcrypt, ApiError];
          expect(HashNewPassword(...params)).resolves.toEqual(
            hashedPasswordResult
          );
        });
      });
    });
  });
});
