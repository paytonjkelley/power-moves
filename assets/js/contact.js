
(function () {
'use strict';
const byId = id => document.getElementById(id);
const reason = new URLSearchParams(location.search).get('reason');
if (reason && Array.from(byId('c-reason').options).some(o => o.value === reason)) byId('c-reason').value = reason;
['c-message','p-request'].forEach(id => {const el=byId(id), count=byId(id+'-count'); if(count) el.addEventListener('input',()=>count.querySelector('[data-count]').textContent=el.value.length);});
const dialog=byId('prayer-dialog');
byId('prayer-open').addEventListener('click',()=>dialog.showModal());
['prayer-close','prayer-done'].forEach(id=>byId(id).addEventListener('click',()=>dialog.close()));
const follow=byId('p-followup');
follow.addEventListener('change',()=>{byId('p-contact-fields').hidden=!follow.checked;byId('p-contact-fields').disabled=!follow.checked;follow.setAttribute('aria-expanded',String(follow.checked));});
byId('p-contact-fields').disabled=true;
['contact','prayer-form'].forEach(id=>{
const form=byId(id);form.addEventListener('submit',e=>{
e.preventDefault();if(form.elements._honey.value)return;
let valid=true,first=null;
form.querySelectorAll('input,select,textarea').forEach(el=>{if(el.disabled || el.closest('fieldset[disabled]'))return; const ok=el.checkValidity() && (!el.required || el.value.trim().length>0);el.setAttribute('aria-invalid',String(!ok));const error=byId(el.id+'-error');if(error){error.hidden=ok;if(!ok)error.querySelector('span').textContent=el.validationMessage||'Please complete this field.';}if(!ok){valid=false;first=first||el;}});
if(id==='prayer-form'){const missing=follow.checked&&!byId('p-email').value.trim()&&!byId('p-phone').value.trim();const error=byId('p-contact-error');error.hidden=!missing;if(missing){error.querySelector('span').textContent='Please provide an email or phone number.';valid=false;first=first||byId('p-email');}}
if(!valid){first.focus();return;}
const subject=document.createElement('input');subject.type='hidden';subject.name='_subject';subject.value=id==='contact'?'Power Moves — '+byId('c-reason').selectedOptions[0].textContent:'Power Moves — Prayer request';form.appendChild(subject);
form.querySelector('[type=submit]').disabled=true;
HTMLFormElement.prototype.submit.call(form);
});});
})();
