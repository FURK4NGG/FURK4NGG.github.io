﻿function performSearch(){let query=document.getElementById('searchQuery').value;let fileType=document.querySelector('input[name="fileType"]:checked')?.value||"";let searchPoint=document.querySelector('input[name="searchPoint"]:checked')?.value||"";let dork=`intitle:"${query}"`;if(fileType){dork+=` filetype:${fileType}`}
if(searchPoint&&searchPoint!=="article"&&searchPoint!=="book"){dork+=` site:${searchPoint}`}else if(searchPoint==="article"){dork+=` inurl:article`}else if(searchPoint==="book"){dork+=` inurl:book`}
window.open(`https://www.google.com/search?q=${encodeURIComponent(dork)}`);document.getElementById('searchQuery').value="";document.querySelectorAll('input[type="radio"]').forEach(input=>input.checked=!1)}
function redirectVirusTotal(){window.open("https://www.virustotal.com/")}