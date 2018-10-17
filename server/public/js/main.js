$(document).ready(function () {
    var data = [
        {
            "property": "P31",
            "name": "instance of",
            "amount": 819,
            "relevance": 100.00,
            "presence": true
        },
        {
            "property": "P106",
            "name": "occupation",
            "amount": 819,
            "relevance": 100.00,
            "presence": true
        },
        {
            "property": "P21",
            "name": "sex or gender",
            "amount": 803,
            "relevance": 98.05,
            "presence": true
        },
        {
            "property": "P569",
            "name": "date of birth",
            "amount": 737,
            "relevance": 89.99,
            "presence": true
        },
        {
            "property": "P27",
            "name": "country of citizenship",
            "amount": 736,
            "relevance": 89.87,
            "presence": false
        },
        {
            "property": "P19",
            "name": "place of birth",
            "amount": 723,
            "relevance": 88.28,
            "presence": true
        },
        {
            "property": "P735",
            "name": "given name",
            "amount": 710,
            "relevance": 86.69,
            "presence": false
        },
        {
            "property": "P18",
            "name": "image",
            "amount": 637,
            "relevance": 77.78,
            "presence": true
        },
        {
            "property": "P69",
            "name": "educated at",
            "amount": 607,
            "relevance": 74.11,
            "presence": false
        },
        {
            "property": "P450",
            "name": "astronaut mission",
            "amount": 559,
            "relevance": 68.25,
            "presence": false
        },
        {
            "property": "P2873",
            "name": "time in space",
            "amount": 549,
            "relevance": 67.03,
            "presence": true
        },
        {
            "property": "P166",
            "name": "award received",
            "amount": 441,
            "relevance": 53.85,
            "presence": false
        },
        {
            "property": "P2030",
            "name": "NASA biographical ID",
            "amount": 396,
            "relevance": 48.35,
            "presence": true
        },
        {
            "property": "P361",
            "name": "part of",
            "amount": 382,
            "relevance": 46.64,
            "presence": false
        },
        {
            "property": "P108",
            "name": "employer",
            "amount": 381,
            "relevance": 46.52,
            "presence": false
        },
        {
            "property": "P734",
            "name": "family name",
            "amount": 365,
            "relevance": 44.57,
            "presence": false
        },
        {
            "property": "P410",
            "name": "military rank",
            "amount": 349,
            "relevance": 42.61,
            "presence": false
        },
        {
            "property": "P241",
            "name": "military branch",
            "amount": 280,
            "relevance": 34.19,
            "presence": false
        },
        {
            "property": "P570",
            "name": "date of death",
            "amount": 163,
            "relevance": 19.90,
            "presence": false
        },
        {
            "property": "P20",
            "name": "place of death",
            "amount": 148,
            "relevance": 18.07,
            "presence": false
        },
        {
            "property": "P1412",
            "name": "languages spoken, written or signed",
            "amount": 116,
            "relevance": 14.16,
            "presence": false
        },
        {
            "property": "P1559",
            "name": "name in native language",
            "amount": 109,
            "relevance": 13.31,
            "presence": false
        },
        {
            "property": "P39",
            "name": "position held",
            "amount": 93,
            "relevance": 11.36,
            "presence": false
        },
        {
            "property": "P1196",
            "name": "manner of death",
            "amount": 89,
            "relevance": 10.87,
            "presence": false
        },
        {
            "property": "P1343",
            "name": "described by source",
            "amount": 87,
            "relevance": 10.62,
            "presence": false
        },
        {
            "property": "P102",
            "name": "member of political party",
            "amount": 82,
            "relevance": 10.01,
            "presence": false
        },
        {
            "property": "P2002",
            "name": "Twitter username",
            "amount": 81,
            "relevance": 9.89,
            "presence": false
        },
        {
            "property": "P509",
            "name": "cause of death",
            "amount": 77,
            "relevance": 9.40,
            "presence": false
        },
        {
            "property": "P119",
            "name": "place of burial",
            "amount": 66,
            "relevance": 8.06,
            "presence": false
        },
        {
            "property": "P463",
            "name": "member of ",
            "amount": 62,
            "relevance": 7.57,
            "presence": false
        },
        {
            "property": "P103",
            "name": "native language",
            "amount": 62,
            "relevance": 7.57,
            "presence": false
        },
        {
            "property": "P910",
            "name": "topic's main category",
            "amount": 61,
            "relevance": 7.45,
            "presence": false
        },
        {
            "property": "P1441",
            "name": "present in work",
            "amount": 45,
            "relevance": 5.49,
            "presence": false
        },
        {
            "property": "P26",
            "name": "spouse",
            "amount": 36,
            "relevance": 4.40,
            "presence": false
        },
        {
            "property": "P512",
            "name": "academic degree",
            "amount": 33,
            "relevance": 4.03,
            "presence": false
        },
        {
            "property": "P1477",
            "name": "birth name",
            "amount": 30,
            "relevance": 3.66,
            "presence": false
        },
        {
            "property": "P856",
            "name": "official website",
            "amount": 28,
            "relevance": 3.42,
            "presence": false
        },
        {
            "property": "P607",
            "name": "conflict",
            "amount": 27,
            "relevance": 3.30,
            "presence": false
        },
        {
            "property": "P793",
            "name": "significant event",
            "amount": 25,
            "relevance": 3.05,
            "presence": false
        },
        {
            "property": "P1080",
            "name": "from fictional universe",
            "amount": 24,
            "relevance": 2.93,
            "presence": false
        },
        {
            "property": "P937",
            "name": "work location",
            "amount": 20,
            "relevance": 2.44,
            "presence": false
        },
        {
            "property": "P175",
            "name": "performer",
            "amount": 20,
            "relevance": 2.44,
            "presence": false
        },
        {
            "property": "P109",
            "name": "signature",
            "amount": 20,
            "relevance": 2.44,
            "presence": false
        },
        {
            "property": "P22",
            "name": "father",
            "amount": 18,
            "relevance": 2.20,
            "presence": false
        },
        {
            "property": "P140",
            "name": "religion",
            "amount": 17,
            "relevance": 2.08,
            "presence": false
        },
        {
            "property": "P172",
            "name": "ethnic group",
            "amount": 15,
            "relevance": 1.83,
            "presence": false
        },
        {
            "property": "P2868",
            "name": "subject has role",
            "amount": 13,
            "relevance": 1.59,
            "presence": false
        },
        {
            "property": "P40",
            "name": "child",
            "amount": 12,
            "relevance": 1.47,
            "presence": false
        },
        {
            "property": "P767",
            "name": "contributor(s) to the creative work",
            "amount": 10,
            "relevance": 1.22,
            "presence": false
        },
        {
            "property": "P1814",
            "name": "name in kana",
            "amount": 10,
            "relevance": 1.22,
            "presence": false
        },
        {
            "property": "P551",
            "name": "residence",
            "amount": 109,
            "relevance": 1.10,
            "presence": false
        }
    ];
    var limit = 0;
    /*eoin v1*/
    $.each(data, function (i, obj) {
        if (obj.presence === false && limit < 10) {
            $('#recoinTable tbody').append(`<tr>
                                <td><label><a href="https://www.wikidata.org/wiki/Property:`+ obj.property + `" target="_blank">` + obj.property + `</a></label>
                                        </td>
                                    <td>` + obj.name + `</td><td>`
                + obj.relevance + ` %</td><td><i class="plus icon"></i></td></tr >`);
            limit++;
        }
    });
/*recoin v2*/
    var limit = 0;
    $.each(data, function (i, obj) {
        if (obj.presence === false ) {
            $('#recoinv2table tbody').append(`<tr>
            <td style="width: 25%"><a href="https://www.wikidata.org/wiki/Property:`+ obj.property + `" target="_blank">` + obj.name + `</a></td>
            <td style="width: 40%"><div class="ui input" >
            <input type="text" placeholder=" ">
            <div id="rv2addvalue">add value</div>
        </div></td>
           <td style="width: 35%"> <!--<span>`
                + Math.round(obj.relevance) + ` %</span>-->
                <div class="label" style="font-size: 10px; text-align: left"> added for `+ obj.amount +` of 819 other existing astronauts
                </div>
                <div class="ui teal tiny progress" >
                <div class=" bar" style="width:` + Math.round(obj.relevance) + `%"></div>

            </div></td>
        </tr>`);
            limit++;
        }
    });



    recoinInit();

   
    $('.ui.accordion').accordion();

    $("button").click(function(e) {
        var fired_button = $(this).val();
        renderRecoin(fired_button);
    });

    $(document).ready(function() {
        $('#my-range').range({
            min: 0,
            max: 10,
            start: 5
        });
    });
});

function recoinInit(){
    renderRecoin(10);
}

   /*pagination recoinv2*/
    
   function renderRecoin(rowNumber){
    $('#recoinpagination').after('<div class="ui pagination menu"></div>');
    var rowsShown = rowNumber; /*default 10 aber onchlick*/
    var rowsTotal = $('#recoinv2table tbody tr').length;
    var numPages = rowsTotal/rowsShown;
    for(i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $('.ui.pagination.menu').append('<a href="#/" class="item" rel="'+i+'">'+pageNum+'</a> ');
    }
    $('#recoinv2table tbody tr').hide();
    $('#recoinv2table tbody tr').slice(0, rowsShown).show();
    $('.ui.pagination.menu a:first').addClass('active');
    $('.ui.pagination.menu a').bind('click', function(){

        $('.ui.pagination.menu a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#recoinv2table tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
        css('display','table-row').animate({opacity:1}, 300);
    });
}