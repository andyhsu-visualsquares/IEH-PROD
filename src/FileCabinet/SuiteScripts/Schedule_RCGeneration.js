function Schedule_rcgeneration()
{
//	var recid = nlapiGetRecordId();
	var recid = nlapiGetContext().getSetting('SCRIPT', 'custscript_Genid');
	nlapiLogExecution('debug', 'recid', recid);
	
	var recRCgen = nlapiLoadRecord('customrecordrcgenerator',recid);
	var VoucherProd = recRCgen.getFieldValue('custrecordrcgeneratorvoucherprod');
	var RedeemProd = recRCgen.getFieldValue('custrecordrcgeneratorredeemprod');
	var RedeemValue = recRCgen.getFieldValue('custrecordrcgeneratorredeemvalue');
	var FaceValue = recRCgen.getFieldValue('custrecordrcgeneratorfacevalue');
	var Qty = recRCgen.getFieldValue('custrecordrcgeneratorqty');
	var EffectiveEndDate = recRCgen.getFieldValue('custrecordrcgeneratoreffectivedate');
	var EffectiveStartDate = recRCgen.getFieldValue('custrecord_start_date');
	var Channel = recRCgen.getFieldValue('custrecordrcgeneratorchannel');
	var Prefix = ifnull(recRCgen.getFieldValue('custrecordrcgeneratorprefix'));
	var Suffix = ifnull(recRCgen.getFieldValue('custrecordrcgeneratorsuffix'));
	var Digit = recRCgen.getFieldValue('custrecordrcgeneratordigit');
	var Encryption = recRCgen.getFieldValue('custrecordrcgeneratorencryption');
	var RedeemVoucherItem = recRCgen.getFieldValue('custrecordrcgeneratorredeemvoucheritem');
	// var Code = Prefix + Digit + Suffix;
	nlapiLogExecution('debug', 'Encryption', Encryption);
	
	var num1 = recRCgen.getFieldValue('custrecord_start_num');
	
	
	
	for (var x = 1; x <= Qty; x++)
	{
		var num = num1;
		nlapiLogExecution('debug', 'x.length', x.length);
	//	var strX = String(x);
		var strX = String(num);
		for (var y = strX.length; y <= Digit; y++)
		{
			if(Digit - y > 0)
			{
				num = "0" + num;
			}
		}
		nlapiLogExecution('debug', 'num', num);
		
		var Code = Prefix + num + Suffix;
		// var CodeEncry = sha256(Code);
		var CodeEncry = CryptoJS.MD5(Code).toString();
		
		var RC_rec = nlapiCreateRecord('customrecordrcmaster');
		RC_rec.setFieldValue('custrecordrcmastervoucheritem',VoucherProd);
		RC_rec.setFieldValue('custrecordrcmasterredeemprod',RedeemProd);	
		RC_rec.setFieldValue('custrecordrcmasterredeemvalue',RedeemValue);
		RC_rec.setFieldValue('custrecordrcmasterrc',Code);
		RC_rec.setFieldValue('custrecordrcmastereffectivedate',EffectiveEndDate);
		RC_rec.setFieldValue('custrecord_effective_start_date',EffectiveStartDate);
		RC_rec.setFieldValue('custrecordrcmasterchannel',Channel);
		RC_rec.setFieldValue('custrecordrcmastergennum',recid);
		RC_rec.setFieldValue('custrecordrcmastervoucheritem',VoucherProd);
		RC_rec.setFieldValue('custrecordredeemvoucheritem',RedeemVoucherItem);
		if(Encryption == 'T')
		{
			RC_rec.setFieldValue('name',CodeEncry);
		}
		else
		{
			RC_rec.setFieldValue('name',Code);
		}
		var RC_ID = nlapiSubmitRecord(RC_rec);
      checkGovernance();
		nlapiLogExecution('debug', 'RC_ID', RC_ID);
		num1++;
	}
//  recRCgen.setFieldValue('custrecordrcgeneratorstatus',2);
//  var id=nlapiSubmitRecord(recRCgen);

	num1--;
	var fields =  new Array();
	fields[0] = 'custrecordrcgeneratorstatus';
	fields[1] = 'custrecord_end_num';
	var values = new Array();
	values[0] = 2;
	values[1] = num1;
  nlapiSubmitField('customrecordrcgenerator',recid,fields,values);
  //nlapiLogExecution('debug','id',id);
}

function checkGovernance()
{
	var myGovernanceThreshold = 300;
	var context = nlapiGetContext();
	if( context.getRemainingUsage() < myGovernanceThreshold )
	{
		var state = nlapiYieldScript();
		if( state.status == 'FAILURE')
	{
		nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
		throw "Failed to yield script";
	} 
		else if ( state.status == 'RESUME' )
	{
		nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
	}
		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
	}
}


function sha256(ascii) {
	function rightRotate(value, amount) {
		return (value>>>amount) | (value<<(32 - amount));
	};
	
	var mathPow = Math.pow;
	var maxWord = mathPow(2, 32);
	var lengthProperty = 'length'
	var i, j; // Used as a counter across the whole file
	var result = ''

	var words = [];
	var asciiBitLength = ascii[lengthProperty]*8;
	
	//* caching results is optional - remove/add slash from front of this line to toggle
	// Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
	// (we actually calculate the first 64, but extra values are just ignored)
	var hash = sha256.h = sha256.h || [];
	// Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
	var k = sha256.k = sha256.k || [];
	var primeCounter = k[lengthProperty];
	/*/
	var hash = [], k = [];
	var primeCounter = 0;
	//*/

	var isComposite = {};
	for (var candidate = 2; primeCounter < 64; candidate++) {
		if (!isComposite[candidate]) {
			for (i = 0; i < 313; i += candidate) {
				isComposite[i] = candidate;
			}
			hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
			k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
		}
	}
	
	ascii += '\x80' // Append Ƈ' bit (plus zero padding)
	while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
	for (i = 0; i < ascii[lengthProperty]; i++) {
		j = ascii.charCodeAt(i);
		if (j>>8) return; // ASCII check: only accept characters in range 0-255
		words[i>>2] |= j << ((3 - i)%4)*8;
	}
	words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
	words[words[lengthProperty]] = (asciiBitLength)
	
	// process each chunk
	for (j = 0; j < words[lengthProperty];) {
		var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
		var oldHash = hash;
		// This is now the undefinedworking hash", often labelled as variables a...g
		// (we have to truncate as well, otherwise extra entries at the end accumulate
		hash = hash.slice(0, 8);
		
		for (i = 0; i < 64; i++) {
			var i2 = i + j;
			// Expand the message into 64 words
			// Used below if 
			var w15 = w[i - 15], w2 = w[i - 2];

			// Iterate
			var a = hash[0], e = hash[4];
			var temp1 = hash[7]
				+ (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
				+ ((e&hash[5])^((~e)&hash[6])) // ch
				+ k[i]
				// Expand the message schedule if needed
				+ (w[i] = (i < 16) ? w[i] : (
						w[i - 16]
						+ (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
						+ w[i - 7]
						+ (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
					)|0
				);
			// This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
			var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
				+ ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
			
			hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
			hash[4] = (hash[4] + temp1)|0;
		}
		
		for (i = 0; i < 8; i++) {
			hash[i] = (hash[i] + oldHash[i])|0;
		}
	}
	
	for (i = 0; i < 8; i++) {
		for (j = 3; j + 1; j--) {
			var b = (hash[i]>>(j*8))&255;
			result += ((b < 16) ? 0 : '') + b.toString(16);
		}
	}
	return result;
}

function ifnull(a)
{
  if(a)
    return a;
  else
    return '';
}