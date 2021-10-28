window._uiWidgets = [];
window._uiWidgetsWithHandle = [];
let retryHandler = 50;
let resetRetry = 2;
let running = false;
console.log("Heloooo Eddieeeeeeeeeeee");

/**
 * pushStateHook
 * Hook to detect when pages change
 */
(function (history) {
  var pushState = history.pushState;
  history.pushState = function (state) {
    retryHandler = 20;
    resetRetry = 3;
    tryGetWidgetsWithHandler();
    tryGetProducts();
    return pushState.apply(history, arguments);
  };
})(window.history);

let getAllWidgetsWithHandlerInput = function () {
  $('.null input[name=open-section]').hide();
  window._uiWidgetsWithHandle = $('input[name=open-section]').not('.pmi-added');
};

window.onscroll = function () {
  if (!running) tryGetWidgetsWithHandler();
};

const tryGetWidgetsWithHandler = function () {
  running = true;
  let time = 100;
  retryHandler--;
  setTimeout(function () {
    getAllWidgetsWithHandlerInput();
    if (retryHandler > 0 && resetRetry > 0) {
      handleWidgetsByType();
      tryGetWidgetsWithHandler();
    } else if (retryHandler === 0 && resetRetry > 0) {
      time = 500;
      resetRetry--;
      retryHandler = 20;
      handleWidgetsByType();
      tryGetWidgetsWithHandler();
    } else {
      handleWidgetsByType();
      window._uiWidgetsWithHandle = [];
      retryHandler = 20;
      resetRetry = 3;
      running = false;
    }
  }, time);
};

window._products = [];
let products_retryHandler = 20;
let products_resetRetry = 2;
let products_running = false;

let getProducts = function () {
  window._products = $(
    '.prize-details .descriptionContainer lightning-formatted-text'
  );
};

const tryGetProducts = function () {
  products_running = true;
  let time = 100;
  products_retryHandler--;
  setTimeout(function () {
    getProducts();
    if (products_retryHandler > 0 && products_resetRetry > 0) {
      handlerProducts();
      tryGetProducts();
    } else if (products_retryHandler === 0 && products_resetRetry > 0) {
      time = 500;
      products_resetRetry--;
      products_retryHandler = 20;
      handlerProducts();
      tryGetProducts();
    } else {
      handlerProducts();
      window._products = [];
      products_retryHandler = 20;
      products_resetRetry = 3;
      products_running = false;
    }
  }, time);
};

let handlerProducts = function () {
  window._products.each(function (p) {
    let $handlerElement = $(window._products[p]);
    if ($handlerElement !== undefined && $handlerElement[0] !== undefined) {
      let element = $handlerElement[0];
      let text = element.outerText;
      let bonus = element.outerText.indexOf('{{bonus}}');
      let locked = element.outerText.indexOf('{{locked}}');

      let baseClassName = 'pmiopen-';
      if (bonus > -1) {
        let t = text.replace(/{{bonus}}/gm, '');
        $(element).html(t);
        let bonusClass = baseClassName + 'bonus';
        $(element).parent().parent().parent().parent().addClass(bonusClass);
      }
      if (locked > -1) {
        let t = text.replace(/{{locked}}/gm, '');
        $(element).html(t);
        let lockedClass = baseClassName + 'locked';
        $(element).parent().parent().parent().parent().addClass(lockedClass);
      }
    }
  });

  $('div.slds-outputTextBody').each(function (p) {
    let finalTextToReplace = $(this).html();
    $(this).html(
      finalTextToReplace.replace(/{{bonus}}/gm, '').replace(/{{locked}}/gm, '')
    );
  });
};

let handleWidgetsByType = function () {
  window._uiWidgetsWithHandle.each(function (a) {
    let $handlerElement = $(window._uiWidgetsWithHandle[a]);
    applyToAll($handlerElement);
  });
};

let applyToAll = function ($handlerElement) {
  let baseClassName = 'pmiopen-';
  let classToApply = $handlerElement.val();
  let idToApply = $handlerElement.attr('data-id');
  classToApply =
    baseClassName + classToApply.replace(/( )/gm, ' ' + baseClassName);

  let $parentsWidgets = $handlerElement
    .parents('.ui-widget')
    .not('.siteforceDesignTimeComponent');
  let $main = $parentsWidgets.last();
  let $own = $parentsWidgets.first();

  $own.attr('style', 'display:none');
  $handlerElement.addClass('pmi-added');
  $main.addClass(classToApply);
  if (idToApply !== undefined) $main.attr('id', idToApply);
  $own.parent('div').addClass('widgets-wraper');
};

$(document).ready(function () {
  // tryGetWidgetsWithHandler();
  $('.null input[name=open-section]').hide();
  tryGetWidgetsWithHandler();

  tryGetProducts();

  //get back button click
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function () {
      tryGetWidgetsWithHandler();
      tryGetProducts();
    });
  }

  if ($('#vsbutton').length > 0) {
    $(document).on(
      'click',
      '.pmiopen-cli-support .pmiopen-btn-outline',
      function (e) {
        e.preventDefault();
        $('#vsbutton').addClass('vsopen');
        $('#vscontainer').attr('style', 'display: block; visibility: visible;');
      }
    );
  }
});

document.addEventListener(
  'DOMContentLoaded',
  function () {
    $('.null input[name=open-section]').hide();
    tryGetWidgetsWithHandler();
    tryGetProducts();
  },
  false
);

// iframe handler
let lastHeight = 0;
window.onmessage = (e) => {
  let iframe = document.getElementsByTagName('iframe');

  if (iframe.length > 0) {
    let newHeight = e.data.frameHeight;
    if (e !== undefined)
      $('.ui-widget').find('iframe').parent('div').attr('style', `min-height: 400px`)

    if (e.data.hasOwnProperty("frameHeight") && lastHeight !== newHeight) {
      $('.ui-widget').find('iframe').parent('div').attr('style', `height: ${newHeight}px`)
      lastHeight = newHeight;
    }
  }
};
