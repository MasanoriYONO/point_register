// This is a JavaScript file
var input_div;
var map_div = "";
var saved_date = "";
var map_lat;
var map_lng;
var array_points = [];
var json_str = "";
var confirm_id = 0;
var delete_id = 0;
var detail_id = 0;
var p_db = window.openDatabase("monaca_research", "1.0", "monaca_research", 24 * 1024 * 1024);

function point(id, divisoin, recdate, lat, lng, option){
    this.id = id;
    this.division = divisoin;
    this.recdate = recdate;
    this.lat = lat;
    this.lng = lng;
    this.option = option;
}

function modify_div(id){
    confirm_id = id
    
    navigator.notification.confirm(
        "この地点の情報を削除する場合は「削除」を押してください。", 
        deleteCallback, 
        "この地点について", 
        ["削除","キャンセル"]);
    
}

function deleteCallback(buttonIndex){
    
    if(buttonIndex == 1){
        delete_id = array_points[confirm_id].id;
        console.log("deleteCallback:" + delete_id);
        
        map_delete_DB();
    }
}

function view_detail(index){
    detail_id = index;
    var options = {id:index,title:array_points[index].division};
    myNavigator.pushPage('page_map_detail.html', options);
}

$(document).on('pageinit', '#page_detail_map', function(event) {
    var page = myNavigator.getCurrentPage();
    
    $("#v_title").text(page.options.title);
});

function start_activity_html(){
    if(monaca.isIOS){
        window.open('http://road2win.plala.jp/e-velo/report/sqlite3/regi_point.php?act=point_view&appkey=5667bb827e2193c961000e46', '_system');
    }
    if(monaca.isAndroid){
        window.plugins.webintent.startActivity(
            {
                action: window.plugins.webintent.ACTION_VIEW,
                url:  'http://road2win.plala.jp/e-velo/report/sqlite3/regi_point.php?act=point_view&appkey=5667bb827e2193c961000e46'
            },
            function() {},
            function() {console.log('Failed to open URL via Android Intent');}        
        );
    }
}

//// DB作成。
function map_populateSQL(tx) {
    console.log("map_populateSQL.");
    // tx.executeSql('DROP TABLE IF EXISTS POINT');
    tx.executeSql('CREATE TABLE IF NOT EXISTS POINT (id INTEGER PRIMARY KEY AUTOINCREMENT, division , recdate, lat, lng, option)');
}
// DB初期化。
function map_resetSQL(tx) {
    console.log("map_resetSQL.");
    
    tx.executeSql('DROP TABLE IF EXISTS POINT');
    tx.executeSql('CREATE TABLE IF NOT EXISTS POINT (id INTEGER PRIMARY KEY AUTOINCREMENT, division , recdate, lat, lng, option)');
}

function map_insertSQL(tx) {
    console.log("map_insertSQL.");
    
    tx.executeSql('INSERT INTO POINT (division, recdate, lat, lng) VALUES ("'
        + map_div + '","' + saved_date + '",' + map_lat + ',' + map_lng +')');
}

function map_delete_SQL(tx) {
    console.log("map_delete_SQL.");
    
    tx.executeSql('DELETE FROM POINT WHERE id = ' + delete_id);
    
}

function map_delete_DB(){
    console.log("map_delete_DB.");
    
    p_db.transaction(map_delete_SQL, map_errorCB, map_get_saved_date_FromDB);
}

function map_createDB() {
    console.log("map_createDB.");
    
    p_db.transaction(map_populateSQL, map_errorCB);
}

function map_resetDB() {
    console.log("map_resetDB.");
    
    p_db.transaction(map_resetSQL, map_errorCB);
}

function map_insertDB() {
    console.log("map_insertDB.");
    
    p_db.transaction(map_insertSQL, map_errorCB, map_insert_success_CB);
}

function map_get_saved_date_FromDB() {
    console.log("map_get_saved_date_FromDB.");
    
    p_db.transaction(map_saved_date_SQL, map_errorCB);
}

function map_saved_date_SQL(tx) {
    console.log("map_saved_date_SQL.");
    
    tx.executeSql(
        'SELECT * FROM POINT ORDER BY id desc '
        , []
        , map_saved_date_querySuccess
        , map_errorCB);
}

function map_saved_date_querySuccess(sql, results){
    console.log("map_saved_date_querySuccess.");
    
    // 配列の初期化
    array_points = [];
    json_str = "";
    
    for(var i = 0 ; i < results.rows.length; i++){
        var temp_point = new point(results.rows.item(i).id,
                        results.rows.item(i).division,
                        results.rows.item(i).recdate,
                        results.rows.item(i).lat,
                        results.rows.item(i).lng,
                        results.rows.item(i).option);
        
        array_points.push(temp_point);
    }
        
    for(var i=0; i < array_points.length; i++){
        // console.log(array_points[i].id);
        // console.log(array_points[i].division);
        // console.log(array_points[i].recdate);
        // console.log(array_points[i].lat);
        // console.log(array_points[i].lng);
        // console.log(array_points[i].option);
        
        $("#btn_view").attr('disabled', false);
        
        json_str = JSON.stringify({"points": array_points});
        console.log(json_str);
    }
    
    var points_list = new PointList();
    points_list.load();
}

function map_insert_success_CB() {
    console.log("map_insert_success_CB.");
    
    p_db.transaction(map_saved_date_SQL, map_errorCB);
}

function map_resetDB() {
    console.log("map_resetDB.");
	
    p_db.transaction(map_resetSQL, map_errorCB);
}

function map_errorCB(err) {
    console.log("map_errorCB.");
    console.log("SQL 実行中にエラーが発生しました: " + err.message);
}

function map_modifyCallback(results){
    console.log("modifyCallback.");
    if(results.buttonIndex == 1){
        
        // update_div_id = array_points[confirm_id].id;
        map_div = results.input1;
        var m = moment();
        saved_date = m.format("YYYY-MM-DD HH:mm:ss");
    
        console.log(map_div);
        
        map_insertDB();
    }
}

function send_json(){
    $.ajax({
        type:"post",
        url:"http://road2win.plala.jp/e-velo/report/sqlite3/regi_point.php",
        data:{
            'appkey': '5667bb827e2193c961000e46',
            'act': 'insert',
            'json': json_str
        },
        async : false,
        cache : true,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("If-Modified-Since",
            "Thu, 01 Jun 1970 00:00:00 GMT");
        },
        dataType:"json",
        success:function(data){
            console.log("successed");
            var res_str = JSON.stringify(data);
            console.log(res_str);
            
            navigator.notification.confirm(
                data.insert + '件追加しました。', // メッセージ
                 onSendConfirm,            // 押されたボタンのインデックスを使用して呼び出すコールバック
                '送信しました。',           // タイトル
                ['OK']     // ボタンのラベル名
            );
            
        },error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown.message);
        }
    });
}

function onSendConfirm(){
    
}