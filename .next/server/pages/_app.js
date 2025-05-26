/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./context/CartContext.js":
/*!********************************!*\
  !*** ./context/CartContext.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   CartContext: () => (/* binding */ CartContext),\n/* harmony export */   CartProvider: () => (/* binding */ CartProvider)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst CartContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)();\nconst CartProvider = ({ children })=>{\n    const [cartItems, setCartItems] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const addToCart = (product)=>{\n        setCartItems((prev)=>{\n            const existing = prev.find((item)=>item.id === product.id);\n            if (existing) {\n                return prev.map((item)=>item.id === product.id ? {\n                        ...item,\n                        quantity: item.quantity + 1\n                    } : item);\n            }\n            return [\n                ...prev,\n                {\n                    ...product,\n                    quantity: 1\n                }\n            ];\n        });\n    };\n    const removeFromCart = (id)=>{\n        setCartItems((prev)=>prev.filter((item)=>item.id !== id));\n    };\n    const clearCart = ()=>setCartItems([]);\n    const updateQuantity = (id, quantity)=>{\n        setCartItems((prev)=>prev.map((item)=>item.id === id ? {\n                    ...item,\n                    quantity: Number(quantity)\n                } : item));\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(CartContext.Provider, {\n        value: {\n            cartItems,\n            addToCart,\n            removeFromCart,\n            clearCart,\n            updateQuantity\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"D:\\\\Internship\\\\Shopping\\\\NextJSProject\\\\my-ecommerce-site\\\\context\\\\CartContext.js\",\n        lineNumber: 35,\n        columnNumber: 5\n    }, undefined);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbnRleHQvQ2FydENvbnRleHQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUF1RDtBQUVoRCxNQUFNRyw0QkFBY0Ysb0RBQWFBLEdBQUc7QUFFcEMsTUFBTUcsZUFBZSxDQUFDLEVBQUVDLFFBQVEsRUFBRTtJQUN2QyxNQUFNLENBQUNDLFdBQVdDLGFBQWEsR0FBR0wsK0NBQVFBLENBQUMsRUFBRTtJQUU3QyxNQUFNTSxZQUFZLENBQUNDO1FBQ2pCRixhQUFhLENBQUNHO1lBQ1osTUFBTUMsV0FBV0QsS0FBS0UsSUFBSSxDQUFDLENBQUNDLE9BQVNBLEtBQUtDLEVBQUUsS0FBS0wsUUFBUUssRUFBRTtZQUMzRCxJQUFJSCxVQUFVO2dCQUNaLE9BQU9ELEtBQUtLLEdBQUcsQ0FBQyxDQUFDRixPQUNmQSxLQUFLQyxFQUFFLEtBQUtMLFFBQVFLLEVBQUUsR0FBRzt3QkFBRSxHQUFHRCxJQUFJO3dCQUFFRyxVQUFVSCxLQUFLRyxRQUFRLEdBQUc7b0JBQUUsSUFBSUg7WUFFeEU7WUFDQSxPQUFPO21CQUFJSDtnQkFBTTtvQkFBRSxHQUFHRCxPQUFPO29CQUFFTyxVQUFVO2dCQUFFO2FBQUU7UUFDL0M7SUFDRjtJQUVBLE1BQU1DLGlCQUFpQixDQUFDSDtRQUN0QlAsYUFBYSxDQUFDRyxPQUFTQSxLQUFLUSxNQUFNLENBQUMsQ0FBQ0wsT0FBU0EsS0FBS0MsRUFBRSxLQUFLQTtJQUMzRDtJQUVBLE1BQU1LLFlBQVksSUFBTVosYUFBYSxFQUFFO0lBRXZDLE1BQU1hLGlCQUFpQixDQUFDTixJQUFJRTtRQUMxQlQsYUFBYSxDQUFDRyxPQUNaQSxLQUFLSyxHQUFHLENBQUMsQ0FBQ0YsT0FDUkEsS0FBS0MsRUFBRSxLQUFLQSxLQUFLO29CQUFFLEdBQUdELElBQUk7b0JBQUVHLFVBQVVLLE9BQU9MO2dCQUFVLElBQUlIO0lBR2pFO0lBRUEscUJBQ0UsOERBQUNWLFlBQVltQixRQUFRO1FBQUNDLE9BQU87WUFBRWpCO1lBQVdFO1lBQVdTO1lBQWdCRTtZQUFXQztRQUFlO2tCQUM1RmY7Ozs7OztBQUdQLEVBQUUiLCJzb3VyY2VzIjpbIkQ6XFxJbnRlcm5zaGlwXFxTaG9wcGluZ1xcTmV4dEpTUHJvamVjdFxcbXktZWNvbW1lcmNlLXNpdGVcXGNvbnRleHRcXENhcnRDb250ZXh0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBjb25zdCBDYXJ0Q29udGV4dCA9IGNyZWF0ZUNvbnRleHQoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBDYXJ0UHJvdmlkZXIgPSAoeyBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3QgW2NhcnRJdGVtcywgc2V0Q2FydEl0ZW1zXSA9IHVzZVN0YXRlKFtdKTtcclxuXHJcbiAgY29uc3QgYWRkVG9DYXJ0ID0gKHByb2R1Y3QpID0+IHtcclxuICAgIHNldENhcnRJdGVtcygocHJldikgPT4ge1xyXG4gICAgICBjb25zdCBleGlzdGluZyA9IHByZXYuZmluZCgoaXRlbSkgPT4gaXRlbS5pZCA9PT0gcHJvZHVjdC5pZCk7XHJcbiAgICAgIGlmIChleGlzdGluZykge1xyXG4gICAgICAgIHJldHVybiBwcmV2Lm1hcCgoaXRlbSkgPT5cclxuICAgICAgICAgIGl0ZW0uaWQgPT09IHByb2R1Y3QuaWQgPyB7IC4uLml0ZW0sIHF1YW50aXR5OiBpdGVtLnF1YW50aXR5ICsgMSB9IDogaXRlbVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFsuLi5wcmV2LCB7IC4uLnByb2R1Y3QsIHF1YW50aXR5OiAxIH1dO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVtb3ZlRnJvbUNhcnQgPSAoaWQpID0+IHtcclxuICAgIHNldENhcnRJdGVtcygocHJldikgPT4gcHJldi5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uaWQgIT09IGlkKSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgY2xlYXJDYXJ0ID0gKCkgPT4gc2V0Q2FydEl0ZW1zKFtdKTtcclxuXHJcbiAgY29uc3QgdXBkYXRlUXVhbnRpdHkgPSAoaWQsIHF1YW50aXR5KSA9PiB7XHJcbiAgICBzZXRDYXJ0SXRlbXMoKHByZXYpID0+XHJcbiAgICAgIHByZXYubWFwKChpdGVtKSA9PlxyXG4gICAgICAgIGl0ZW0uaWQgPT09IGlkID8geyAuLi5pdGVtLCBxdWFudGl0eTogTnVtYmVyKHF1YW50aXR5KSB9IDogaXRlbVxyXG4gICAgICApXHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Q2FydENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3sgY2FydEl0ZW1zLCBhZGRUb0NhcnQsIHJlbW92ZUZyb21DYXJ0LCBjbGVhckNhcnQsIHVwZGF0ZVF1YW50aXR5IH19PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0NhcnRDb250ZXh0LlByb3ZpZGVyPlxyXG4gICk7XHJcbn07XHJcbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VTdGF0ZSIsIkNhcnRDb250ZXh0IiwiQ2FydFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJjYXJ0SXRlbXMiLCJzZXRDYXJ0SXRlbXMiLCJhZGRUb0NhcnQiLCJwcm9kdWN0IiwicHJldiIsImV4aXN0aW5nIiwiZmluZCIsIml0ZW0iLCJpZCIsIm1hcCIsInF1YW50aXR5IiwicmVtb3ZlRnJvbUNhcnQiLCJmaWx0ZXIiLCJjbGVhckNhcnQiLCJ1cGRhdGVRdWFudGl0eSIsIk51bWJlciIsIlByb3ZpZGVyIiwidmFsdWUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./context/CartContext.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _context_CartContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../context/CartContext */ \"(pages-dir-node)/./context/CartContext.js\");\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_CartContext__WEBPACK_IMPORTED_MODULE_2__.CartProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"D:\\\\Internship\\\\Shopping\\\\NextJSProject\\\\my-ecommerce-site\\\\pages\\\\_app.js\",\n            lineNumber: 7,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\Internship\\\\Shopping\\\\NextJSProject\\\\my-ecommerce-site\\\\pages\\\\_app.js\",\n        lineNumber: 6,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUErQjtBQUN1QjtBQUV0RCxTQUFTQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ3JDLHFCQUNFLDhEQUFDSCw4REFBWUE7a0JBQ1gsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUI7QUFFQSxpRUFBZUYsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsiRDpcXEludGVybnNoaXBcXFNob3BwaW5nXFxOZXh0SlNQcm9qZWN0XFxteS1lY29tbWVyY2Utc2l0ZVxccGFnZXNcXF9hcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFscy5jc3MnO1xyXG5pbXBvcnQgeyBDYXJ0UHJvdmlkZXIgfSBmcm9tICcuLi9jb250ZXh0L0NhcnRDb250ZXh0JztcclxuXHJcbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xyXG4gIHJldHVybiAoXHJcbiAgICA8Q2FydFByb3ZpZGVyPlxyXG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XHJcbiAgICA8L0NhcnRQcm92aWRlcj5cclxuICApO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNeUFwcDsiXSwibmFtZXMiOlsiQ2FydFByb3ZpZGVyIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./pages/_app.js"));
module.exports = __webpack_exports__;

})();