var express = require('express'),
	os=require('os'),
	pm2=require('pm2'),
	app = express();

//Information
app.get('/serverStat',function(req,res){
	var _stat={
		system_info:{
			hostName:os.hostname(),
			uptime:os.uptime()
		},
		monit:{
			loadavg:os.loadavg(),
			total_mem:os.totalmem(),
			free_mem:os.freemem(),
			cpu:os.cpus(),
			interfaces:os.networkInterfaces()
		},
		os:{
			type:os.type(),
			platform:os.platform(),
			release:os.release(),
		},		
		cpu_arch:os.arch(),
		loadAvg:os.loadavg(),
	
	};
	pm2.connect(function(){
		pm2.list(function(err,list){
			pm2.disconnect();
			_stat.processes=list;
			res.json(_stat);
		});
	});
});

//Operations
app.get('/operations/stop/:id',function(request,response){
	if(!request.params.id){
		response.send(400 ,{
			error:"Process id not supplied"
		});
		return;
	}
	pm2.connect(function(){
		pm2.stop(request.params.id,function(err,details){
			if(err){
				console.log(err);
				response.send(err)
			}else
				response.send(details);
			pm2.disconnect();
		})
	});
});

app.get('/operations/restart/:id',function(request,response){
	if(!request.params.id){
		response.send(400 ,{
			error:"Process id not supplied"
		});
		return;
	}
	pm2.connect(function(){
		pm2.restart(request.params.id,function(err,details){
			if(err){
				console.log(err);
				response.send(err)
			}else
				response.send(details);
			pm2.disconnect();
		})
	});
});

app.get('/operations/delete/:id',function(request,response){
	if(!request.params.id){
		response.send(400 ,{
			error:"Process id not supplied"
		});
		return;
	}
	pm2.connect(function(){
		pm2.delete(request.params.id,function(err,status){
			if(err){
				console.log(err);
				response.send(err)
			}else
				response.send(status);
			pm2.disconnect();
		})
	});
});

app.get('/operations/kill',function(request,response){
	pm2.connect(function(){
		pm2.killDaemon(function(err,status){
			if(err){
				console.log(err);
				response.send(err)
			}else
				response.send(status);
		})
	});
});

app.use('/',express.static(__dirname+'/web/'));

var server = app.listen(3190);