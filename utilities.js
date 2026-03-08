<!-- Platform Sniffer -->
<!--

browserCheck();

function browserCheck() {
    var agent = navigator.userAgent.toLowerCase();
    // alert(agent);
    this.major = parseInt(navigator.appVersion); 
    this.minor = parseFloat(navigator.appVersion); 
    this.ns  = ((agent.indexOf('mozilla')!=-1) && ((agent.indexOf('spoofer')==-1) && (agent.indexOf('compatible') == -1)));
    this.ns6 = (this.ns && (this.major == 5));
    this.ie   = (agent.indexOf("msie") != -1);
	this.ie5 =  (this.ie && agent.indexOf("msie 5")!=-1);
    this.win   = (agent.indexOf("win")!=-1);
    this.mac   = (agent.indexOf("mac")!=-1);
        
    if (this.ns6) {
    document.write('<link rel="stylesheet" href="/style_nn6_e.css" type="text/css">');
    document.close();
    } else if (this.ie5 && this.mac) {
	document.write('<link rel="stylesheet" href="/style_wie_e.css" type="text/css">');
    document.close();
    } else if (this.mac) {
	document.write('<link rel="stylesheet" href="/style_m_e.css" type="text/css">');
    document.close();	
    } else if (this.win && this.ns) {
	document.write('<link rel="stylesheet" href="/style_wnn_e.css" type="text/css">');
    document.close();
    } else {
	document.write('<link rel="stylesheet" href="/style_wie_e.css" type="text/css">');
    document.close();	
    }
    

}

//-->

<!-- Mouseovers and Pre-Loading of Images -->
<!--
function MM_swapImgRestore() { //v2.0
  if (document.MM_swapImgData != null)
    for (var i=0; i<(document.MM_swapImgData.length-1); i+=2)
      document.MM_swapImgData[i].src = document.MM_swapImgData[i+1];
}

function MM_preloadImages() { //v2.0
  if (document.images) {
    var imgFiles = MM_preloadImages.arguments;
    if (document.preloadArray==null) document.preloadArray = new Array();
    var i = document.preloadArray.length;
    with (document) for (var j=0; j<imgFiles.length; j++) if (imgFiles[j].charAt(0)!="#"){
      preloadArray[i] = new Image;
      preloadArray[i++].src = imgFiles[j];
  } }
}

function MM_swapImage() { //v2.0
  var i,j=0,objStr,obj,swapArray=new Array,oldArray=document.MM_swapImgData;
  for (i=0; i < (MM_swapImage.arguments.length-2); i+=3) {
    objStr = MM_swapImage.arguments[(navigator.appName == 'Netscape')?i:i+1];
    if ((objStr.indexOf('document.layers[')==0 && document.layers==null) ||
        (objStr.indexOf('document.all[')   ==0 && document.all   ==null))
      objStr = 'document'+objStr.substring(objStr.lastIndexOf('.'),objStr.length);
    obj = eval(objStr);
    if (obj != null) {
      swapArray[j++] = obj;
      swapArray[j++] = (oldArray==null || oldArray[j-1]!=obj)?obj.src:oldArray[j];
      obj.src = MM_swapImage.arguments[i+2];
  } }
  document.MM_swapImgData = swapArray; //used for restore
}
//-->

<!-- Controls window openings -->
<!--
function MM_openBrWindow(theURL,winName,features) { //v2.0
  window.open(theURL,winName,features);
}
//-->

