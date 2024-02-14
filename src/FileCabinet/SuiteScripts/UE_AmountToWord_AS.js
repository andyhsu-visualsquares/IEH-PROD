function UE_AmountToWord_AS(type)
{
	if(type!='delete')
	{
		nlapiSetFieldValue('custbody_payment_word', toWords(nlapiGetFieldValue('payment')));
	}
}

function toWords(s) {
	var th = ['','thousand','million', 'billion','trillion'];
	var dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'];
	var tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
	var tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
	var ct = ['zero','ten','twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    s = s.toString();
    s = s.replace(/[\, ]/g,'');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    if (x > 15)
        return 'too big';
    var n = s.split(''); 
    var str = '';
    var sk = 0;
    for (var i=0;   i < x;  i++) {
        if ((x-i)%3==2) { 
            if (n[i] == '1') {
                str += tn[Number(n[i+1])] + ' ';
                i++;
                sk=1;
            } else if (n[i]!=0) {
                str += tw[n[i]-2] + ' ';
                sk=1;
            }
        } else if (n[i]!=0) { // 0235
            str += dg[n[i]] +' ';
            if ((x-i)%3==0) str += 'hundred ';
            sk=1;
        }
        if ((x-i)%3==1) {
            if (sk)
                str += th[(x-i-1)/3] + ' ';
            sk=0;
        }
    }
    str += 'dollars ';
    if (x != s.length) {
		
		var cent = 'true';
		var y = s.length;
		for (var i=x+1; i<y-1; i++)
		{
			if (n[i] == 0)
				cent = 'false';
		}
		if(cent == 'true')
		{
			var y = s.length;
			str += 'and ';
			for (var i=x+1; i<y-1; i++)
				str += ct[n[i]] +' ';
			str += 'cents';
		}
    }
    return str.replace(/\s+/g,' ');
}