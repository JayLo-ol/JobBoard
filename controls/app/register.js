var models=require('../../models/models.js');
var crypto=require('crypto');

module.exports={
	home:function *(next) {
		yield this.render('app/register.html',{title:'註冊'});
	},
	handleRegister:function *(next) {
		try {
			var user={
				username:this.request.body.username,
				password:this.request.body.password,
				email:this.request.body.email,
				priority: 1,//一般使用者權限值=1 欲創造管理者使用mongo輸入以下指令
				//db.users.update( { "username": "使用者名稱" },{ $set : { priority :2} })
			};
			var md5=crypto.createHash('md5');
			user.salt=new Date()+user.username;//md5 salt
			user.password=md5.update(user.password+user.salt,'utf8').digest('base64');//md5加鹽加密

			var result=yield models.User.find({username:user.username});
			if (result.length==0) {
				yield models.User.create(user);
				this.session.username=user.username;
				this.status=303;
				this.redirect('/');
			}else{
				this.body='此帳號已存在';
			}
		} catch(e) {
			this.body='註冊失敗';
			console.log(e);
		}
	}
}