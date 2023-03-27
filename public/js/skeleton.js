// this function loads the nav bar and footer into html doc

function loadSkeleton() {
  // console.log($('#navbarPlaceholder').load('/app/html/component/header.html'));
  console.log($("#navbarPlaceholder").load("/header"));
  console.log($("#bannerPlaceholder").load("/banner"));
  console.log($("#footerPlaceholder").load("/footer"));
}
loadSkeleton(); //invokes function

//link to jquery at head section: <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
//copy this into navbar section of html doc: <nav id="navbarPlaceholder"></nav>
//copy this into footer section of html doc: <nav id="footerPlaceholder"></nav>
//link to skeleton.js script at end of body
