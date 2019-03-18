/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-prototype-builtins */
/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */
/* eslint-disable func-names */
/*
    PDFObject v2.0.201604172
    https://github.com/pipwerks/PDFObject
    Copyright (c) 2008-2016 Philip Hutchison
    MIT-style license: http://pipwerks.mit-license.org/
    UMD module pattern from https://github.com/umdjs/umd/blob/master/templates/returnExports.js
*/
/*
(function (root, factory) { if (typeof define === 'function' && define.amd) { define([], factory); } else if (typeof module === 'object' && module.exports) { module.exports = factory(); } else { root.PDFObject = factory(); } }(this, () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') { return false; } const pdfobjectversion = '2.0.201604172'; let supportsPDFs; let createAXO; let isIE; let supportsPdfMimeType = typeof navigator.mimeTypes['application/pdf'] !== 'undefined'; let supportsPdfActiveX; let buildFragmentString; let log; let embedError; let embed; let getTargetElement; let generatePDFJSiframe; let isIOS = (function () { return /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase()); }()); let
    generateEmbedElement; createAXO = function (type) { let ax; try { ax = new ActiveXObject(type); } catch (e) { ax = null; } return ax; }; isIE = function () { return !!(window.ActiveXObject || 'ActiveXObject' in window); }; supportsPdfActiveX = function () { return !!(createAXO('AcroPDF.PDF') || createAXO('PDF.PdfCtrl')); }; supportsPDFs = supportsPdfMimeType || isIE() && supportsPdfActiveX(); buildFragmentString = function (pdfParams) {
    let string = ''; let
      prop; if (pdfParams) { for (prop in pdfParams) { if (pdfParams.hasOwnProperty(prop)) { string += `${encodeURIComponent(prop)}=${encodeURIComponent(pdfParams[prop])}&`; } } if (string) { string = `#${string}`; string = string.slice(0, string.length - 1); } } return string;
  }; log = function (msg) { if (typeof console !== 'undefined' && console.log) { console.log(`[PDFObject] ${msg}`); } }; embedError = function (msg) { log(msg); return false; }; getTargetElement = function (targetSelector) { let targetNode = document.body; if (typeof targetSelector === 'string') { targetNode = document.querySelector(targetSelector); } else if (typeof jQuery !== 'undefined' && targetSelector instanceof jQuery && targetSelector.length) { targetNode = targetSelector.get(0); } else if (typeof targetSelector.nodeType !== 'undefined' && targetSelector.nodeType === 1) { targetNode = targetSelector; } return targetNode; }; generatePDFJSiframe = function (targetNode, url, pdfOpenFragment, PDFJS_URL, id) { const fullURL = `${PDFJS_URL}?file=${encodeURIComponent(url)}${pdfOpenFragment}`; const scrollfix = isIOS ? '-webkit-overflow-scrolling: touch; overflow-y: scroll; ' : 'overflow: hidden; '; const iframe = `<div style='${scrollfix}position: absolute; top: 0; right: 0; bottom: 0; left: 0;'><iframe  ${id} src='${fullURL}' style='border: none; width: 100%; height: 100%;' frameborder='0'></iframe></div>`; targetNode.className += ' pdfobject-container'; targetNode.style.position = 'relative'; targetNode.style.overflow = 'auto'; targetNode.innerHTML = iframe; return targetNode.getElementsByTagName('iframe')[0]; }; generateEmbedElement = function (targetNode, targetSelector, url, pdfOpenFragment, width, height, id) { let style = ''; if (targetSelector && targetSelector !== document.body) { style = `width: ${width}; height: ${height};`; } else { style = 'position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;'; }targetNode.className += ' pdfobject-container'; targetNode.innerHTML = `<embed ${id} class='pdfobject' src='${url}${pdfOpenFragment}' type='application/pdf' style='overflow: auto; ${style}'/>`; return targetNode.getElementsByTagName('embed')[0]; }; embed = function (url, targetSelector, options) {
    if (typeof url !== 'string') { return embedError('URL is not valid'); }targetSelector = typeof targetSelector !== 'undefined' ? targetSelector : false; options = typeof options !== 'undefined' ? options : {}; let id = options.id && typeof options.id === 'string' ? `id='${options.id}'` : ''; let page = options.page ? options.page : false; let pdfOpenParams = options.pdfOpenParams ? options.pdfOpenParams : {}; let fallbackLink = typeof options.fallbackLink !== 'undefined' ? options.fallbackLink : true; let width = options.width ? options.width : '100%'; let height = options.height ? options.height : '100%'; let forcePDFJS = typeof options.forcePDFJS === 'boolean' ? options.forcePDFJS : false; let PDFJS_URL = options.PDFJS_URL ? options.PDFJS_URL : false; let targetNode = getTargetElement(targetSelector); let fallbackHTML = ''; let pdfOpenFragment = ''; let
      fallbackHTML_default = "<p>This browser does not support inline PDFs. Please download the PDF to view it: <a href='[url]'>Download PDF</a></p>"; if (!targetNode) { return embedError('Target element cannot be determined'); } if (page) { pdfOpenParams.page = page; }pdfOpenFragment = buildFragmentString(pdfOpenParams); if (forcePDFJS && PDFJS_URL) { return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id); } if (supportsPDFs) { return generateEmbedElement(targetNode, targetSelector, url, pdfOpenFragment, width, height, id); } if (PDFJS_URL) { return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id); } if (fallbackLink) { fallbackHTML = typeof fallbackLink === 'string' ? fallbackLink : fallbackHTML_default; targetNode.innerHTML = fallbackHTML.replace(/\[url\]/g, url); } return embedError('This browser does not support embedded PDFs');
  }; return { embed(a, b, c) { return embed(a, b, c); }, pdfobjectversion: (function () { return pdfobjectversion; }()), supportsPDFs: (function () { return supportsPDFs; }()) };
})); */
/* eslint-disable */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PDFObject = factory();
  }
})(this, function() {
  'use strict';
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  var pdfobjectversion = '2.0.201604172',
    supportsPDFs,
    createAXO,
    isIE,
    supportsPdfMimeType = typeof navigator.mimeTypes['application/pdf'] !== 'undefined',
    supportsPdfActiveX,
    buildFragmentString,
    log,
    embedError,
    embed,
    getTargetElement,
    generatePDFJSiframe,
    isIOS = (function() {
      return /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    })(),
    generateEmbedElement;
  createAXO = function(type) {
    var ax;
    try {
      ax = new ActiveXObject(type);
    } catch (e) {
      ax = null;
    }
    return ax;
  };
  isIE = function() {
    return !!(window.ActiveXObject || 'ActiveXObject' in window);
  };
  supportsPdfActiveX = function() {
    return !!(createAXO('AcroPDF.PDF') || createAXO('PDF.PdfCtrl'));
  };
  supportsPDFs = supportsPdfMimeType || (isIE() && supportsPdfActiveX());
  buildFragmentString = function(pdfParams) {
    var string = '',
      prop;
    if (pdfParams) {
      for (prop in pdfParams) {
        if (pdfParams.hasOwnProperty(prop)) {
          string += encodeURIComponent(prop) + '=' + encodeURIComponent(pdfParams[prop]) + '&';
        }
      }
      if (string) {
        string = '#' + string;
        string = string.slice(0, string.length - 1);
      }
    }
    return string;
  };
  log = function(msg) {
    if (typeof console !== 'undefined' && console.log) {
      console.log('[PDFObject] ' + msg);
    }
  };
  embedError = function(msg) {
    log(msg);
    return false;
  };
  getTargetElement = function(targetSelector) {
    var targetNode = document.body;
    if (typeof targetSelector === 'string') {
      targetNode = document.querySelector(targetSelector);
    } else if (
      typeof jQuery !== 'undefined' &&
      targetSelector instanceof jQuery &&
      targetSelector.length
    ) {
      targetNode = targetSelector.get(0);
    } else if (typeof targetSelector.nodeType !== 'undefined' && targetSelector.nodeType === 1) {
      targetNode = targetSelector;
    }
    return targetNode;
  };
  generatePDFJSiframe = function(targetNode, url, pdfOpenFragment, PDFJS_URL, id) {
    var fullURL = PDFJS_URL + '?file=' + encodeURIComponent(url) + pdfOpenFragment;
    var scrollfix = isIOS
      ? '-webkit-overflow-scrolling: touch; overflow-y: scroll; '
      : 'overflow: hidden; ';
    var iframe =
      "<div style='" +
      scrollfix +
      "position: absolute; top: 0; right: 0; bottom: 0; left: 0;'><iframe  " +
      id +
      " src='" +
      fullURL +
      "' style='border: none; width: 100%; height: 100%;' frameborder='0'></iframe></div>";
    targetNode.className += ' pdfobject-container';
    targetNode.style.position = 'relative';
    targetNode.style.overflow = 'auto';
    targetNode.innerHTML = iframe;
    return targetNode.getElementsByTagName('iframe')[0];
  };
  generateEmbedElement = function(
    targetNode,
    targetSelector,
    url,
    pdfOpenFragment,
    width,
    height,
    id
  ) {
    var style = '';
    if (targetSelector && targetSelector !== document.body) {
      style = 'width: ' + width + '; height: ' + height + ';';
    } else {
      style =
        'position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;';
    }
    targetNode.className += ' pdfobject-container';
    targetNode.innerHTML =
      '<embed ' +
      id +
      " class='pdfobject' src='" +
      url +
      pdfOpenFragment +
      "' type='application/pdf' style='overflow: auto; " +
      style +
      "'/>";
    return targetNode.getElementsByTagName('embed')[0];
  };
  embed = function(url, targetSelector, options) {
    if (typeof url !== 'string') {
      return embedError('URL is not valid');
    }
    targetSelector = typeof targetSelector !== 'undefined' ? targetSelector : false;
    options = typeof options !== 'undefined' ? options : {};
    var id = options.id && typeof options.id === 'string' ? "id='" + options.id + "'" : '',
      page = options.page ? options.page : false,
      pdfOpenParams = options.pdfOpenParams ? options.pdfOpenParams : {},
      fallbackLink = typeof options.fallbackLink !== 'undefined' ? options.fallbackLink : true,
      width = options.width ? options.width : '100%',
      height = options.height ? options.height : '100%',
      forcePDFJS = typeof options.forcePDFJS === 'boolean' ? options.forcePDFJS : false,
      PDFJS_URL = options.PDFJS_URL ? options.PDFJS_URL : false,
      targetNode = getTargetElement(targetSelector),
      fallbackHTML = '',
      pdfOpenFragment = '',
      fallbackHTML_default =
        "<p>This browser does not support inline PDFs. Please download the PDF to view it: <a href='[url]'>Download PDF</a></p>";
    if (!targetNode) {
      return embedError('Target element cannot be determined');
    }
    if (page) {
      pdfOpenParams.page = page;
    }
    pdfOpenFragment = buildFragmentString(pdfOpenParams);
    if (forcePDFJS && PDFJS_URL) {
      return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);
    } else if (supportsPDFs) {
      return generateEmbedElement(
        targetNode,
        targetSelector,
        url,
        pdfOpenFragment,
        width,
        height,
        id
      );
    } else {
      if (PDFJS_URL) {
        return generatePDFJSiframe(targetNode, url, pdfOpenFragment, PDFJS_URL, id);
      } else if (fallbackLink) {
        fallbackHTML = typeof fallbackLink === 'string' ? fallbackLink : fallbackHTML_default;
        targetNode.innerHTML = fallbackHTML.replace(/\[url\]/g, url);
      }
      return embedError('This browser does not support embedded PDFs');
    }
  };
  return {
    embed: function(a, b, c) {
      return embed(a, b, c);
    },
    pdfobjectversion: (function() {
      return pdfobjectversion;
    })(),
    supportsPDFs: (function() {
      return supportsPDFs;
    })(),
  };
});
