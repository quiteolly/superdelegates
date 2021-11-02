// States that are voting in Democratic primary
var states = {};
states.code = {
	'AL': 'Alabama',
	'AK': 'Alaska',
	'AS': 'American Samoa',
	'AZ': 'Arizona',
	'AR': 'Arkansas',
	'DA': 'Democrats Abroad',
	'CA': 'California',
	'CO': 'Colorado',
	'CT': 'Connecticut',
	'DE': 'Delaware',
	'DC': 'District of Columbia',
	'FL': 'Florida',
	'GA': 'Georgia',
	'GU': 'Guam',
	'HI': 'Hawaii',
	'ID': 'Idaho',
	'IL': 'Illinois',
	'IN': 'Indiana',
	'IA': 'Iowa',
	'KS': 'Kansas',
	'KY': 'Kentucky',
	'LA': 'Louisiana',
	'ME': 'Maine',
	'MD': 'Maryland',
	'MA': 'Massachusetts',
	'MI': 'Michigan',
	'MN': 'Minnesota',
	'MS': 'Mississippi',
	'MO': 'Missouri',
	'MT': 'Montana',
	'NE': 'Nebraska',
	'NV': 'Nevada',
	'NH': 'New Hampshire',
	'NJ': 'New Jersey',
	'NM': 'New Mexico',
	'NY': 'New York',
	'NC': 'North Carolina',
	'ND': 'North Dakota',
	'MP': 'Northern Marianas',
	'OH': 'Ohio',
	'OK': 'Oklahoma',
	'OR': 'Oregon',
	'PA': 'Pennsylvania',
	'PR': 'Puerto Rico',
	'RI': 'Rhode Island',
	'SC': 'South Carolina',
	'SD': 'South Dakota',
	'TN': 'Tennessee',
	'TX': 'Texas',
	'UT': 'Utah',
	'VT': 'Vermont',
	'VI': 'Virgin Islands',
	'VA': 'Virginia',
	'WA': 'Washington',
	'WV': 'West Virginia',
	'WI': 'Wisconsin',
	'WY': 'Wyoming'
};

states.name = {
	'Alabama': 'AL',
	'Alaska': 'AK',
	'American Samoa': 'AS',
	'Arizona': 'AZ',
	'Arkansas': 'AR',
	'California': 'CA',
	'Colorado': 'CO',
	'Connecticut': 'CT',
	'Democrats Abroad': 'DA',
	'Delaware': 'DE',
	'District of Columbia': 'DC',
	'Florida': 'FL',
	'Georgia': 'GA',
	'Guam': 'GU',
	'Hawaii': 'HI',
	'Idaho': 'ID',
	'Illinois': 'IL',
	'Indiana': 'IN',
	'Iowa': 'IA',
	'Kansas': 'KS',
	'Kentucky': 'KY',
	'Louisiana': 'LA',
	'Maine': 'ME',
	'Maryland': 'MD',
	'Massachusetts': 'MA',
	'Michigan': 'MI',
	'Minnesota': 'MN',
	'Mississippi': 'MS',
	'Missouri': 'MO',
	'Montana': 'MT',
	'Nebraska': 'NE',
	'Nevada': 'NV',
	'New Hampshire': 'NH',
	'New Jersey': 'NJ',
	'New Mexico': 'NM',
	'New York': 'NY',
	'North Carolina': 'NC',
	'North Dakota': 'ND',
	'Northern Marianas': 'MP',
	'Ohio': 'OH',
	'Oklahoma': 'OK',
	'Oregon': 'OR',
	'Pennsylvania': 'PA',
	'Puerto Rico': 'PR',
	'Rhode Island': 'RI',
	'South Carolina': 'SC',
	'South Dakota': 'SD',
	'Tennessee': 'TN',
	'Texas': 'TX',
	'Utah': 'UT',
	'Vermont': 'VT',
	'Virgin Islands': 'VI',
	'Virginia': 'VA',
	'Washington': 'WA',
	'West Virginia': 'WV',
	'Wisconsin': 'WI',
	'Wyoming': 'WY'
}

// Shortlink
var link = location;
var share = 'The media is misrepresenting the 2016 Democratic primaries by counting superdelegates ahead of time.';

// Transform results into a view model
function init() {
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var types = {
		'C-O': 'Open caucus',
		'C-SO': 'Semi-open caucus',
		'C-SC': 'Semi-closed caucus',
		'C-C': 'Closed caucus',
		'P-O': 'Open primary',
		'P-SO': 'Semi-open primary',
		'P-SC': 'Semi-closed primary',
		'P-C': 'Closed primary'
	}

	// Totals
	var totals = {
		clinton: {
			pledged: 0,
			super: 0
		},
		sanders: {
			pledged: 0,
			super: 0
		},
		total: 0,
		uncommitted: 0
	}

	// States count where counts are rigged
	var rigged = [ 0, 0 ];

	// Real superdelegate counts
	var real = {
		clinton: 0,
		sanders: 0
	}

	// Process data
	var prevDate;
	for (var key in data) {
		var self = {};
		var d = data[key];
		var info = key.split('-');
		var state = info[0];

		// Get month and day
		var date = [ info[1], info[2] ].join('-');
		var month = Number(info[1]) - 1;
		var day = (info[3] ? [ Number(info[2]), Number(info[3]) ].join('-') : Number(info[2]));
		self.date = months[month] + ' ' + day;

		// Type of contest
		var t = d.type.split( '-' );
		t = (t ? t[0] : '');

		self.type = {};
		self.type.letter = t;
		self.type.name = types[d.type];

		// Calculate percents
		var b_pct_s = Math.round((d.sanders.super / d.super) * 100 * 10) / 10;
		var h_pct_s = Math.round((d.clinton.super / d.super) * 100 * 10) / 10;

		// Add values for Bernie
		self.bern = {};
		self.bern.pledged = d.sanders.pledged;
		self.bern.super = d.sanders.super;

		self.bern.pct = {};
		self.bern.pct.pledged = d.sanders.result;
		self.bern.pct.super = b_pct_s;
		self.bern.isRigged = (d.clinton.pledged && b_pct_s > d.sanders.result);

		if (self.bern.isRigged) {
			rigged[0]++;
		}
		totals.sanders.pledged += d.sanders.pledged;
		totals.sanders.super += d.sanders.super;

		// Add values for Hillary
		self.hill = {};
		self.hill.pledged = d.clinton.pledged;
		self.hill.super = d.clinton.super;

		self.hill.pct = {};
		self.hill.pct.pledged = d.clinton.result;
		self.hill.pct.super = h_pct_s;
		self.hill.isRigged = (d.sanders.pledged && h_pct_s > d.clinton.result);

		if (self.hill.isRigged) {
			rigged[1]++;
		}
		totals.clinton.pledged += d.clinton.pledged;
		totals.clinton.super += d.clinton.super;

		// Calculate real superdelegates
		var coeff = (state == 'DA' ? 2 : 1); // DA cast half a vote
		var b_real = Math.round(d.super / 100 * d.sanders.result);
		var h_real = Math.round(d.super / 100 * d.clinton.result);

		real.sanders += b_real / coeff;
		real.clinton += h_real / coeff;

		self.bern.real = b_real;
		self.hill.real = h_real;

		var excess = d.super - real.sanders - real.clinton;
		if (excess >= 0) {
			if (d.sanders.result > d.clinton.result) {
				real.sanders += excess / coeff;
				self.bern.real += excess;
			} else {
				real.clinton += excess / coeff;
				self.hill.real += excess;
			}
		}

		// Was this primary on same day
		var sameDay = (prevDate == date);
		self.prev = !sameDay;
		prevDate = date;

		// Other info
		self.state = states.code[state];
		self.total = d.total;
		totals.total += d.total;

		self.uncommitted = self.total - (d.sanders.pledged + d.sanders.super) - (d.clinton.pledged + d.clinton.super);
		totals.uncommitted += self.uncommitted;

		vm.results.push(self);
	}

	// Calculate totals
	var total_c = totals.clinton.pledged + totals.clinton.super;
	var total_s = totals.sanders.pledged + totals.sanders.super;

	// Calculate the difference
	var ahead = (total_s > total_c);
	var num = ahead ? (total_s - total_c) : (total_c - total_s);
	var dels = 'delegate' + ((num > 1) ? 's' : '');
	var diff = ahead ? 'ahead of Hillary Clinton by ' + num + ' ' + dels : 'behind Hillary Clinton by ' + num + ' ' + dels;
	vm.diffNum(num);
	vm.diff(diff);

	// Calculate the real difference
	var r_ahead = (totals.sanders.pledged + real.sanders) > (totals.clinton.pledged + real.clinton);
	var r_num = r_ahead ? ((totals.sanders.pledged + real.sanders) - (totals.clinton.pledged + real.clinton)) : ((totals.clinton.pledged + real.clinton) - (totals.sanders.pledged + real.sanders));
	var r_pledged = r_num - (ahead ? (totals.sanders.pledged - totals.clinton.pledged) : (totals.clinton.pledged - totals.sanders.pledged));
	var r_dels = 'delegate' + ((r_num > 1) ? 's' : '');
	var r_diff = r_ahead ? 'ahead of Hillary Clinton by ' + r_num + ' ' + r_dels : 'behind Hillary Clinton by ' + r_num + ' ' + r_dels;
	var r_times = Math.round(num / r_num);
	r_times = (r_times === 1 ? Math.round(num / r_num * 10) / 10 : r_times);
	var r_superd = 'The margin in number of delegates would’ve been ' + r_times + ' times lower, with ' + (ahead ? 'Sanders’' : 'Clinton’s') + ' number of “superdelegates” being only ' + r_pledged + ' more than ' + (ahead ? 'Clinton’s' : 'Sanders’') + ' support among them.';
	vm.realDel(r_num + ' ' + r_dels);
	vm.realDiff(r_diff);
	vm.realSuperd(r_superd);

	// Calculate other data
	vm.bern([ totals.sanders.pledged, totals.sanders.super, real.sanders ]);
	vm.hill([ totals.clinton.pledged, totals.clinton.super, real.clinton ]);

	vm.rigged(rigged);
	vm.totals([ totals.total, totals.uncommitted ]);

	// Show the content
	document.querySelector('.js-noscript').remove();
}

// View model
var vm = {
	bern: ko.observableArray(),
	diff: ko.observable(),
	diffNum: ko.observable(),
	disableReal: function() {
		vm.isReal(false);
	},
	enableReal: function() {
		vm.isReal(true);
		document.querySelector('.b-top').scrollIntoView({ behavior: 'smooth' });
	},
	hill: ko.observableArray(),
	isReal: ko.observable(false),
	realDel: ko.observable(),
	realDiff: ko.observable(),
	realSuperd: ko.observable(),
	rigged: ko.observableArray(),
	results: ko.observableArray(),
	share: ko.observableArray([
		{
			cl:'twitter',
			link:'https://twitter.com/intent/tweet?url=' + encodeURIComponent(link) + '&text=' + share,
			name:'Tweet'
		},
		{
			cl:'facebook',
			link:'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link),
			name:'Share on Facebook'
		},
		{
			cl:'tumblr',
			link:'https://www.tumblr.com/share/link?canonicalUrl=' + encodeURIComponent(link) + '&title=#superrigged&content=' + share,
			name:'Post on Tumblr'
		},
		{
			cl:'google',
			link:'https://plus.google.com/share?url=' + encodeURIComponent(link),
			name:'Share on Google+'
		}
	]),
	shareReal: function() {
		document.querySelector('.b-bottom').scrollIntoView({ behavior: 'smooth' });
	},
	superd: ko.observable(),
	totals: ko.observableArray()
}

ko.applyBindings(vm);
init();