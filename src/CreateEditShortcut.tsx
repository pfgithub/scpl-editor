import React, { Component } from "react";

import "./CreateEditShortcut.css";



export class CreateEditShortcut extends Component<{}> {
	render() {
		return (
			<div>
				<div className="large-btn cancel-btn" id="close-new">Cancel</div>
				<h1>New ScPL File</h1>
				<div className="input-label">Shortcut Name</div>
				<input type="text" placeholder="My New Shortcut, Cool Idea, etc." id="new-name"/>

				<br/><br/>

				<div className="input-label">Glyph</div>
				<br/>
				<div className="glyphs-container">

				<div className="glyph-cat" id="gc-objects">
					<div className="glyph-header">Objects</div>

					<div className="radio glyph-radio">
						<input type="radio" name="glyph" id="glyph-car" defaultChecked/>
						<label htmlFor="glyph-car"></label>
					</div>

					{
  					["amb","house","cart","forkknife","sun","cloud","tree","footprints","compass","photo","camera","videomarker","calendar","comment","paperairplane","creditcard","smartphone","emptykeyboard","printer","database","cube","puzzle","speaker","bookmark","mask","dice","soccer","lifesaver","chess","stopwatch","platter","trophy","flag","hourglass","battery","paintbrush","scissors","colorpicker","hammerwrench","screwdriver","trashcan","soupbowl","fish","wineglass","oven","showerhead","pillbottle","scope","beaker","pawprint","gift","stairs","bus","plane","hospital","purse","gaspump","moon","rain","flower","signs","earth","film","videocamera","playbutton-one","message","letter","suitcase","watch","laptop","calculator","harddrive","servers","television","headphones","books","emptyglasses","ticket","baseball","tennisball","telescope","clock","volume","heart","lightbulb","tag","locked","magicwand","pencil","magnify","tool","gears","hand","teardrop","apple","cake","hanger","shirt","pill","bandaid","needle","cat","like","alien","rocket","motorcycle","boat","city","stand","temp","snow","umbrella","fire","binoculars","mountain","filmfull","microphone","clipboard","messages","openletter","folder","phone","keyboard","stats","serverset","inbox","controller","musicnote","book","glasses","masks","basketball","football","microscope","alarmclock","bell","star","lightning","key","unlocked","magicstar","paperclip","link","wrench","hammer","privacy","cup","carrot","bottle","laundry","bath","pills","inhaler","atom","dog","cap","bed"].map(id =>
    					<div className="radio glyph-radio">
      					<input type="radio" name="glyph" id={"glyph-"+id}/>
      					<label htmlFor={"glyph-"+id}></label>
    					</div>
  					)
					}

				</div>

				<div className="glyph-cat" id="gc-objects">
					<div className="glyph-header">People</div>

					{
  					["girlbaby","mansymbol","user","accessibility","dance","snowboard","activity","boybaby","womansymbol","users","podium","gym","swim","sprint","person","handicap","group","handraised","hike","hiking","cane"].map(id =>
    					<div className="radio glyph-radio">
      					<input type="radio" name="glyph" id={"glyph-"+id}/>
      					<label htmlFor={"glyph-"+id}></label>
    					</div>
  					)
					}

				</div>

				<div className="glyph-cat" id="gc-objects">
					<div className="glyph-header">Symbols</div>

					{
  					["alert","bookmarkthis","stopfilled","left","up","play","stop","checked","moneysign","yensign","info","money","yen","filefilled","list","more","share","spinner","target","location","crop","move","playsolo","rss","quotes","text","shareleft","barcode","frame","right","down","prev","next","plus","eurosign","bitcoinsign","smile","euro","bitcoin","file","document","listitems","infinite","loading","podcasts","mapmarker","exit","repeat","shuffle","signal","peace","cloudservice","shareright","qrcode","sizes","download","upload","power","help","xfilled","pounds","pi","cssfile","poundsign","asterisk","filedoc","fourgrid","sixgrid","recycle","playvideo","bigtarget","squarep","resize","sync","settings","wifi","nuclear"].map(id =>
    					<div className="radio glyph-radio">
      					<input type="radio" name="glyph" id={"glyph-"+id}/>
      					<label htmlFor={"glyph-"+id}></label>
    					</div>
  					)
					}

				</div>

				</div>

				<br/><br/>

				<div className="input-label">Color</div>
				<br/>
				<div className="color-select">
					<div className="radio color-radio">
						<input type="radio" name="color" id="color-red" defaultChecked/>
						<label htmlFor="color-red"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-darkorange"/>
						<label htmlFor="color-darkorange"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-orange"/>
						<label htmlFor="color-orange"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-yellow"/>
						<label htmlFor="color-yellow"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-green"/>
						<label htmlFor="color-green"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-seagreen"/>
						<label htmlFor="color-seagreen"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-lightblue"/>
						<label htmlFor="color-lightblue"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-blue"/>
						<label htmlFor="color-blue"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-darkblue"/>
						<label htmlFor="color-darkblue"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-darkpurple"/>
						<label htmlFor="color-darkpurple"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-purple"/>
						<label htmlFor="color-purple"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-pink"/>
						<label htmlFor="color-pink"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-black"/>
						<label htmlFor="color-black"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-brown"/>
						<label htmlFor="color-brown"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-grey"/>
						<label htmlFor="color-grey"></label>
					</div>
				</div>

				<br/>
				<div className="large-btn" id="close-new">Create</div>
			</div>
		);
	}
}
