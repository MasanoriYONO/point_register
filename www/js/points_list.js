// This is a JavaScript file

// This is a JavaScript file

/**
 * PointList class
 */
var PointList = (function() {
    
    var PointList = function(options) {
        //Mask element
        // this.maskEl = "#mask";
        
        //Error message element
        // this.errorEl = "#error-message";
            
        //List container
        this.listEl = "#point_list";

        if (options) {
            $.extend(this, options);
        }
        
        this.addClickHandler();
    };
    
    /**
     * Fetch RSS and display the contents of it
     */
    PointList.prototype.load = function() {
        var self = this;

        $(self.listEl).empty();

        // Display RSS contents
        var rss_str = "";
        
        for(var i = 0 ; i < array_points.length; i++){
            $(document).off('hold', "#l_row_" + i);
        // $(document).unbind('hold');
        // $(document).unbind('doubletap');
        // $(document).unbind('touchmove');
        }
        
        for(var i = 0 ; i < array_points.length; i++){
            rss_str += '<ons-list-item modifier="chevron" ' + 
                ' class="list-item-container list__item ons-list-item-inner list__item--chevron" ' + 
                ' onclick="view_detail(' + i + ')" id="l_row_' + i + '">'+
                '<div class="list-item-right"><div class="list-item-content">' + 
                '<div class="name">' + array_points[i].division + '</div>' + 
                '<ons-icon icon="fa-clock-o" class="ons-icon fa-clock-o fa fa-lg"></ons-icon> ' + 
                '<span class="desc">' + array_points[i].recdate + '</span>' + 
                '</div></div></ons-list-item>';
            
            $(document).on('hold', "#l_row_" + i, function(e) {
                console.log("hold " + this.id);
                var id = this.id.replace("l_row_", "");
                modify_div(id);
            });
            
            // $(document).on('doubletap', "#l_row_" + i, function(e) {
            //     console.log("doubletap " + this.id);
            //     var id = this.id.replace("l_row_", "");
            //     delete_rec(id);
            // });
            
            // $(document).on('touchmove', "#l_row_" + i, function(e) {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     console.log("touchmove " + this.id);
            // });
                
        }
        // for debug
        myNavigator.on('postpush', function(e) {
            $(e.enterPage.element).find(self.listEl).empty();
            $(e.enterPage.element).find(self.listEl).append(rss_str);
        });
        $(self.listEl).append(rss_str);
    };

    PointList.prototype.addClickHandler = function() {
        $(this.listEl).on('click', 'li', function() {
            var url = $(this).data('link');

            if (/^http/.test(url)) {
                var ref = window.open(url, '_blank', 'location=yes');
                ref.addEventListener("exit", function() {});
            } else {
                alert('Invalid URL.');
            }
        });
    };
    
    
    PointList.prototype.escape = function(string) {
        return htmlspecialchars(string, 'ENT_QUOTES');
    };
    
    return PointList;
})();

/**
 * htmlspecialchars
 *
 * @see http://phpjs.org/
 */
function htmlspecialchars(string, quote_style, charset, double_encode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Mirek Slugen
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Nathan
    // +   bugfixed by: Arno
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // +      input by: Mailfaker (http://www.weedem.fr/)
    // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +      input by: felix
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: charset argument not supported
    // *     example 1: htmlspecialchars("<a href='test'>Test</a>", 'ENT_QUOTES');
    // *     returns 1: '&lt;a href=&#039;test&#039;&gt;Test&lt;/a&gt;'
    // *     example 2: htmlspecialchars("ab\"c'd", ['ENT_NOQUOTES', 'ENT_QUOTES']);
    // *     returns 2: 'ab"c&#039;d'
    // *     example 3: htmlspecialchars("my "&entity;" is still here", null, null, false);
    // *     returns 3: 'my &quot;&entity;&quot; is still here'
    var optTemp = 0,
        i = 0,
        noquotes = false;
    if (typeof quote_style === 'undefined' || quote_style === null) {
        quote_style = 2;
    }
    string = string.toString();
    if (double_encode !== false) { // Put this first to avoid double-encoding
        string = string.replace(/&/g, '&amp;');
    }
    string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    var OPTS = {
        'ENT_NOQUOTES': 0,
        'ENT_HTML_QUOTE_SINGLE': 1,
        'ENT_HTML_QUOTE_DOUBLE': 2,
        'ENT_COMPAT': 2,
        'ENT_QUOTES': 3,
        'ENT_IGNORE': 4
    };
    if (quote_style === 0) {
        noquotes = true;
    }
    if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
        quote_style = [].concat(quote_style);
        for (i = 0; i < quote_style.length; i++) {
            // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
            if (OPTS[quote_style[i]] === 0) {
                noquotes = true;
            } else if (OPTS[quote_style[i]]) {
                optTemp = optTemp | OPTS[quote_style[i]];
            }
        }
        quote_style = optTemp;
    }
    if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/'/g, '&#039;');
    }
    if (!noquotes) {
        string = string.replace(/"/g, '&quot;');
    }

    return string;
}

/**
 * strip_tags
 *
 * @see http://phpjs.org/
 */
function strip_tags(input, allowed) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Luke Godfrey
    // +      input by: Pul
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +      input by: Alex
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Marc Palau
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Eric Nagel
    // +      input by: Bobby Drake
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Tomasz Wesolowski
    // +      input by: Evertjan Garretsen
    // +    revised by: Rafał Kukawski (http://blog.kukawski.pl/)
    // *     example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
    // *     returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
    // *     example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
    // *     returns 2: '<p>Kevin van Zonneveld</p>'
    // *     example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
    // *     returns 3: '<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>'
    // *     example 4: strip_tags('1 < 5 5 > 1');
    // *     returns 4: '1 < 5 5 > 1'
    // *     example 5: strip_tags('1 <br/> 1');
    // *     returns 5: '1  1'
    // *     example 6: strip_tags('1 <br/> 1', '<br>');
    // *     returns 6: '1  1'
    // *     example 7: strip_tags('1 <br/> 1', '<br><br/>');
    // *     returns 7: '1 <br/> 1'
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}