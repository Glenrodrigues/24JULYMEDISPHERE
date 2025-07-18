let {PythonShell}=require('python-shell')

PythonShell.run("app.py",null,function(err,results){
    console.log(results)
}

)