// this function loads the nav bar and footer into html doc

function loadSkeleton() {

  console.log($("#navbarPlaceholder").load("/header"));
  console.log($("#bannerPlaceholder").load("/banner"));
  console.log($("#footerPlaceholder").load("/footer"));
}
loadSkeleton(); //invokes function


