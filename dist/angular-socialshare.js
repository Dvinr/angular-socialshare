/*
 * @dvinr/angular-socialshare
 * 2.4.0
 * 
 * A social media url and content share module for angularjs.
 * https://github.com/Dvinr/angular-socialshare
 * 
 * MIT license
 * Fri Jun 28 2019
 */
/*global angular*/
/*eslint no-loop-func:0, func-names:0*/

(function withAngular(angular) {
  'use strict';

  var directiveName = 'socialshare'
    , serviceName = 'Socialshare'
    , socialshareProviderNames = ['facebook', 'twitter', 'pinterest']
    , socialshareConfigurationProvider = /*@ngInject*/ function socialshareConfigurationProvider() {

      var socialshareConfigurationDefault = [
      {
        'provider': 'facebook',
        'conf': {
          'url':'',
          'title':'',
          'href':'',
          'quote':'',
          'hashtags':'',
          'text': '',
          'media': '',
          'mobile_iframe': '',
          'type': '',
          'via': '',
          'to': '',
          'from': '',
          'ref': '',
          'display': '',
          'source': '',
          'caption': '',
          'redirectUri': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'twitter',
        'conf': {
          'url': '',
          'text': '',
          'via': '',
          'hashtags': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      },
      {
        'provider': 'pinterest',
        'conf': {
          'url': '',
          'text': '',
          'media': '',
          'trigger': 'click',
          'popupHeight': 600,
          'popupWidth': 500
        }
      }];

      return {
        'configure': function configure(configuration) {

          var configIndex = 0
            , configurationKeys
            , configurationIndex
            , aConfigurationKey
            , configElement
            , internIndex = 0
          //this is necessary becuase provider run before any service
          //so i have to take the log from another injector
          , $log = angular.injector(['ng']).get('$log');

          if (configuration && configuration.length > 0) {
            for (; configIndex < configuration.length; configIndex += 1) {
              if (configuration[configIndex].provider && socialshareProviderNames.indexOf(configuration[configIndex].provider) > -1) {

                for (; internIndex < socialshareConfigurationDefault.length; internIndex += 1) {
                  configElement = socialshareConfigurationDefault[internIndex];

                  if (configElement &&
                    configElement.provider &&
                    configuration[configIndex].provider === configElement.provider) {

                      configurationKeys = Object.keys(configElement.conf);
                      configurationIndex = 0;

                      for (; configurationIndex < configurationKeys.length; configurationIndex += 1) {

                        aConfigurationKey = configurationKeys[configurationIndex];
                        if (aConfigurationKey && configuration[configIndex].conf[aConfigurationKey]) {

                          configElement.conf[aConfigurationKey] = configuration[configIndex].conf[aConfigurationKey];
                        }
                      }

                      // once the provider has been found and configuration applied
                      // we should reset the internIndex for the next provider match to work correctly
                      // and break, to skip loops on unwanted next providers
                      internIndex = 0;
                      break;
                    }
                  }
                } else {
                  $log.warn('Invalid provider at element ' + configIndex + ' with name:' + configuration[configIndex].provider);
                }
              }
            }
        }
        , '$get': /*@ngInject*/ function instantiateProvider() {

            return socialshareConfigurationDefault;
        }
      };
    }
    , manageFacebookShare = function manageFacebookShare($window, attrs) {

      var urlString;

      if (attrs.socialshareType && attrs.socialshareType === 'feed') {
        // if user specifies that they want to use the Facebook feed dialog
        //(https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.4)
        urlString = 'https://www.facebook.com/dialog/feed?';

        if (attrs.socialshareVia) {
          urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
        }

        if (attrs.socialshareRedirectUri) {
          urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
        }
        if (attrs.socialshareUrl) {
          urlString += '&link=' + encodeURIComponent(attrs.socialshareUrl);
        }

        if (attrs.socialshareTo) {
          urlString += '&to=' + encodeURIComponent(attrs.socialshareTo);
        }

        if (attrs.socialshareDisplay) {
          urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
        }

        if (attrs.socialshareRef) {
          urlString += '&ref=' + encodeURIComponent(attrs.socialshareRef);
        }

        if (attrs.socialshareFrom) {
          urlString += '&from=' + encodeURIComponent(attrs.socialshareFrom);
        }

        if (attrs.socialshareSource) {
          urlString += '&source=' + encodeURIComponent(attrs.socialshareSource);
        }

        $window.open(
          urlString,
          'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else if (attrs.socialshareType && attrs.socialshareType === 'share') {
       // if user specifies that they want to use the Facebook share dialog
       //(https://developers.facebook.com/docs/sharing/reference/share-dialog)
       urlString = 'https://www.facebook.com/dialog/share?';

       if (attrs.socialshareVia) {
         urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
       }

       if (attrs.socialshareRedirectUri) {
         urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
       }

       if (attrs.socialshareUrl) {
         urlString += '&href=' + encodeURIComponent(attrs.socialshareUrl);
       }

       if (attrs.socialshareQuote) {
         urlString += '&quote=' + encodeURIComponent(attrs.socialshareQuote);
       }

       if (attrs.socialshareDisplay) {
         urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
       }

       if (attrs.socialshareMobileiframe) {
       urlString += '&mobile_iframe=' + encodeURIComponent(attrs.socialshareMobileiframe);
       }

       if (attrs.socialshareHashtags) {
         urlString += '&hashtag=' + encodeURIComponent(attrs.socialshareHashtags);
       }


       $window.open(
         urlString,
         'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
         + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else if (attrs.socialshareType && attrs.socialshareType === 'send') {
        // if user specifies that they want to use the Facebook send dialog
        //(https://developers.facebook.com/docs/sharing/reference/send-dialog)
        urlString = 'https://www.facebook.com/dialog/send?';

        if (attrs.socialshareVia) {
          urlString += '&app_id=' + encodeURIComponent(attrs.socialshareVia);
        }

        if (attrs.socialshareRedirectUri) {
          urlString += '&redirect_uri=' + encodeURIComponent(attrs.socialshareRedirectUri);
        }

        if (attrs.socialshareUrl) {
          urlString += '&link=' + encodeURIComponent(attrs.socialshareUrl);
        }

        if (attrs.socialshareTo) {
          urlString += '&to=' + encodeURIComponent(attrs.socialshareTo);
        }

        if (attrs.socialshareDisplay) {
          urlString += '&display=' + encodeURIComponent(attrs.socialshareDisplay);
        }

        $window.open(
          urlString,
          'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);

      } else {
        //otherwise default to using sharer.php
        $window.open(
          'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href)
          , 'Facebook', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
          + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
      }
    }
    , manageTwitterShare = function manageTwitterShare($window, attrs) {
      var urlString = 'https://www.twitter.com/intent/tweet?';

      if (attrs.socialshareText) {
        urlString += 'text=' + encodeURIComponent(attrs.socialshareText);
      }

      if (attrs.socialshareVia) {
        urlString += '&via=' + encodeURIComponent(attrs.socialshareVia);
      }

      if (attrs.socialshareHashtags) {
        urlString += '&hashtags=' + encodeURIComponent(attrs.socialshareHashtags);
      }

      //default to the current page if a URL isn't specified
      urlString += '&url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href);

      $window.open(
        urlString,
        'Twitter', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , managePinterestShare = function managePinterestShare($window, attrs) {

      $window.open(
        'https://www.pinterest.com/pin/create/button/?url=' + encodeURIComponent(attrs.socialshareUrl || $window.location.href) + '&media=' + encodeURIComponent(attrs.socialshareMedia) + '&description=' + encodeURIComponent(attrs.socialshareText)
        , 'Pinterest', 'toolbar=0,status=0,resizable=yes,width=' + attrs.socialsharePopupWidth + ',height=' + attrs.socialsharePopupHeight
        + ',top=' + ($window.innerHeight - attrs.socialsharePopupHeight) / 2 + ',left=' + ($window.innerWidth - attrs.socialsharePopupWidth) / 2);
    }
    , socialshareService = /*@ngInject*/  ['$window', '$log', function socialshareService($window, $log) {

      this.facebookShare = manageFacebookShare;
      this.twitterShare = manageTwitterShare;
      //**** Fb Messenger can't open without an element clicked (href)
      //this.facebookMessengerShare = facebookMessengerShare;
      this.pinterestShare = managePinterestShare;

      this.share = function shareTrigger(serviceShareConf) {

        switch (serviceShareConf.provider) {
          case 'facebook': {
            this.facebookShare($window, serviceShareConf.attrs);
            break;
          }
          case 'twitter': {
            this.twitterShare($window, serviceShareConf.attrs);
            break;
          }
          case 'pinterest': {
            this.pinterestShare($window, serviceShareConf.attrs);
            break;
          }
          default: {
            return;
          }
        }
      };
    }]
    , socialshareDirective = /*@ngInject*/ ['$window', 'socialshareConf', 'Socialshare', '$log', function socialshareDirective($window, socialshareConf, $log) {

      var linkingFunction = function linkingFunction($scope, element, attrs) {

        // observe the values in each of the properties so that if they're updated elsewhere,
        // they are updated in this directive.
        var configurationElement
        , index = 0
        , onEventTriggered = function onEventTriggered() {
          /*eslint-disable no-use-before-define*/
          if (attrs.socialshareProvider in sharingFunctions) {
            sharingFunctions[attrs.socialshareProvider]($window, attrs, element);
          } else {
            return true;
          }
        };
        /*eslint-enable no-use-before-define*/
        //looking into configuration if there is a config for the current provider
        for (; index < socialshareConf.length; index += 1) {
          if (socialshareConf[index].provider === attrs.socialshareProvider) {
            configurationElement = socialshareConf[index];
            break;
          }
        }

        if (socialshareProviderNames.indexOf(configurationElement.provider) === -1) {
          $log.warn('Invalid Provider Name : ' + attrs.socialshareProvider);
        }

        //if some attribute is not define provide a default one
        attrs.socialshareMobileiframe = attrs.socialshareMobileiframe || configurationElement.conf.mobile_iframe;
        attrs.socialshareQuote = attrs.socialshareQuote || configurationElement.conf.quote;
        attrs.socialshareTitle = attrs.socialshareTitle || configurationElement.conf.title;
        attrs.socialshareUrl = attrs.socialshareUrl || configurationElement.conf.url || configurationElement.conf.href;
        attrs.socialshareText = attrs.socialshareText || configurationElement.conf.text;
        attrs.socialshareMedia = attrs.socialshareMedia || configurationElement.conf.media;
        attrs.socialshareType =  attrs.socialshareType || configurationElement.conf.type;
        attrs.socialshareVia = attrs.socialshareVia || configurationElement.conf.via;
        attrs.socialshareTo =  attrs.socialshareTo || configurationElement.conf.to;
        attrs.socialshareFrom =  attrs.socialshareFrom || configurationElement.conf.from;
        attrs.socialshareRef = attrs.socialshareRef || configurationElement.conf.ref;
        attrs.socialshareDislay = attrs.socialshareDislay || configurationElement.conf.display;
        attrs.socialshareSource = attrs.socialshareSource || configurationElement.conf.source;
        attrs.socialshareCaption = attrs.socialshareCaption || configurationElement.conf.caption;
        attrs.socialshareRedirectUri = attrs.socialshareRedirectUri || configurationElement.conf.redirectUri;
        attrs.socialshareTrigger =  attrs.socialshareTrigger || configurationElement.conf.trigger;
        attrs.socialsharePopupHeight = attrs.socialsharePopupHeight || configurationElement.conf.popupHeight;
        attrs.socialsharePopupWidth = attrs.socialsharePopupWidth || configurationElement.conf.popupWidth;
        attrs.socialshareSubreddit = attrs.socialshareSubreddit || configurationElement.conf.subreddit;
        attrs.socialshareDescription = attrs.socialshareDescription || configurationElement.conf.description;
        attrs.socialshareFollow = attrs.socialshareFollow || configurationElement.conf.follow;
        attrs.socialshareHashtags = attrs.socialshareHashtags || configurationElement.conf.hashtags;
        attrs.socialshareBody = attrs.socialshareBody || configurationElement.conf.body;
        attrs.socialshareSubject = attrs.socialshareSubject || configurationElement.conf.subject;
        attrs.socialshareCc = attrs.socialshareCc || configurationElement.conf.cc;
        attrs.socialshareBcc = attrs.socialshareBcc || configurationElement.conf.bcc;

        if (attrs.socialshareTrigger) {

          element.bind(attrs.socialshareTrigger, onEventTriggered);
        } else {

          onEventTriggered();
        }
      };

      return {
        'restrict': 'A',
        'link': linkingFunction
      };
    }]
    , sharingFunctions = {
      'facebook': manageFacebookShare
      , 'twitter': manageTwitterShare
      , 'pinterest': managePinterestShare
    };


  angular.module('720kb.socialshare', [])
  .provider(directiveName + 'Conf', socialshareConfigurationProvider)
  .service(serviceName, socialshareService)
  .directive(directiveName, socialshareDirective);
}(angular));
