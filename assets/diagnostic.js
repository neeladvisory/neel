(function(){var f=document.getElementById('diag-form');if(!f)return;var btn=document.getElementById('diag-btn'),done=document.getElementById('diag-done'),err=document.getElementById('diag-err'),busy=false;
f.addEventListener('submit',function(e){e.preventDefault();if(busy)return;if(!f.checkValidity()){f.reportValidity();return;}
var q=document.getElementById('d-q').value.trim(),w=document.getElementById('d-when').value;var p=new URLSearchParams();
p.append('name',document.getElementById('d-name').value);p.append('business',document.getElementById('d-biz').value);p.append('email',document.getElementById('d-email').value);p.append('phone',document.getElementById('d-phone').value);
f.querySelectorAll('input[name="d-topic"]:checked').forEach(function(c){p.append('topic',c.parentNode.textContent.trim());});
p.append('question',(q?q+' ':'')+'[Needs to decide: '+w+']');p.append('website',document.getElementById('d-web').value);
busy=true;btn.disabled=true;btn.setAttribute('aria-busy','true');btn.dataset.label=btn.innerHTML;btn.innerHTML='<span class="spin" aria-hidden="true"></span>Sending…';err.hidden=true;
fetch('https://script.google.com/macros/s/AKfycbzS_bLSdmvcM7kjCHcGkE5QE9im27pbgEuNy1U2lXnxgVsyNOypOB53_mdNwwrsNznhbA/exec',{method:'POST',mode:'no-cors',body:p}).then(function(){f.hidden=true;done.hidden=false;done.focus();}).catch(function(){err.hidden=false;}).then(function(){busy=false;btn.disabled=false;btn.removeAttribute('aria-busy');btn.innerHTML=btn.dataset.label;});});
document.getElementById('diag-again').addEventListener('click',function(){f.reset();done.hidden=true;f.hidden=false;});})();
