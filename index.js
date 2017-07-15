"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var gm_http_1 = require("gm-http");
var Topic = (function () {
    function Topic() {
        var _this = this;
        this.makeSureFetchButton();
        this.onStateChange(function () {
            var timer = setInterval(function () {
                clearInterval(timer);
                _this.makeSureFetchButton();
            }, 500);
        });
    }
    Topic.prototype.makeSureFetchButton = function () {
        var $topicsContainer = document.getElementById('topics-list-container');
        var $manageTopics = document.querySelector('.js-repo-topics-form-toggle');
        if (!$topicsContainer || !$manageTopics)
            return;
        $topicsContainer.appendChild(this.createButton());
    };
    Topic.prototype.createButton = function () {
        var $button = document.createElement('button');
        $button.className = 'btn-link';
        $button.type = 'button';
        $button.id = 'fetch-from-package';
        $button.style.color = '#4CAF50';
        $button.innerHTML = 'Fetch from package.json';
        $button.onclick = this.onclickHandler.bind(this);
        return $button;
    };
    Topic.prototype.onStateChange = function (func) {
        addEventListener('click', function (event) {
            var $done = document.querySelector('button.js-repo-topics-form-done');
            if (event.target !== $done)
                return;
            func(event);
        }, false);
    };
    Topic.prototype.onclickHandler = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            function check() {
                var $formUl = document.querySelector('.js-tag-input-selected-tags');
                if (!$formUl)
                    return;
                clearInterval(timer);
                var formValues = Array.from($formUl.querySelectorAll('input')).map(function ($input) { return $input.value; });
                var keywords = packageJson['keywords'] || [];
                var $input = document.querySelector('#repo_topics');
                keywords
                    .filter(function (kw) { return kw; })
                    .filter(function (kw) { return formValues.findIndex(function (v) { return v === kw; }) < 0; })
                    .forEach(function (keyword) {
                    $input.value = keyword.replace(/\./g, '-');
                    $input.click();
                    $input.blur();
                });
                $input.focus();
            }
            var $button, packageJson, err_1, timer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event.preventDefault();
                        $button = document.querySelector('.btn-link.js-repo-topics-form-toggle.js-details-target');
                        if (!$button)
                            return [2 /*return*/, console.warn("Can't found the button to show topic...")];
                        $button.click();
                        packageJson = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.fetchPackage()];
                    case 2:
                        packageJson = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [3 /*break*/, 4];
                    case 4:
                        timer = setInterval(check, 500);
                        return [2 /*return*/];
                }
            });
        });
    };
    Topic.prototype.fetchPackage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var $package, packageUrl, res, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $package = document.querySelector('tr.js-navigation-item td.content a[title="package.json"]');
                        packageUrl = $package.href;
                        packageUrl =
                            packageUrl
                                .replace('/blob/', '/')
                                .replace('github', 'raw.githubusercontent') + ("?v=" + Math.random());
                        res = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, gm_http_1["default"].get(packageUrl)];
                    case 2:
                        res = _a.sent();
                        res = JSON.parse(res.response);
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        console.error(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, res];
                }
            });
        });
    };
    return Topic;
}());
new Topic();
