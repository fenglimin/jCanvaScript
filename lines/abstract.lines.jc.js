jCanvaScript.addObject('lines', function()
{
	this.base = function(points, lineColor, fillColor)
	{
		var options = points;
		if(options !== undefined)
		{
			if(typeof options.pop == 'function')
				options = {points: points, lineColor: lineColor, fillColor: fillColor};
			this.shapesCount = 0;
		}
		jCanvaScript.getProto('lines').base.call(this, options);
		if(options.points !== undefined)
			this.points(options.points);
		return this;
	}

	this.getCenter = function(type)
	{
		var point={
			x: this._x0,
			y: this._y0
		}
		for(var i = 1; i < this.shapesCount; i++)
		{
			point.x += this['_x' + i];
			point.y += this['_y' + i];
		}
		point.x = point.x / this.shapesCount;
		point.y = point.y / this.shapesCount;
		return getCenter(this, point, type);
	}

	this.position = function(){
		return jCanvaScript.multiplyPointM(this._x0, this._y0, jCanvaScript.multiplyM(this.matrix(), this.layer().matrix()));
	}

	this.getRect = function(type)
	{
		var 
			minX,
			minY,
			maxX = minX = this._x0,
			maxY = minY = this._y0,
			points;
		for(var i = 1; i < this.shapesCount; i++)
		{
			if( maxX < this['_x' + i] ) maxX = this['_x' + i];
			if( maxY < this['_y' + i] ) maxY = this['_y' + i];
			if( minX > this['_x' + i] ) minX = this['_x' + i];
			if( minY > this['_y' + i] ) minY = this['_y' + i];
		}
		points = {x: minX, y:minY, width: maxX - minX, height: maxY - minY};
		return jCanvaScript.getRect(this, points, type);
	}

	this.addPoint = function()
	{
		this.redraw();
		var names = this.pointNames;
		for(var i = 0; i < names.length; i++)
			this[names[i] + this.shapesCount] = arguments[i];
		this.shapesCount++;
		return this;
	}

	this.delPoint = function(x, y, radius){
		this.redraw();
		if(y === undefined)
		{
			var points = this.points();
			points.splice(x, 1)
			this.points(points);
		}
		else{
			radius = radius || 0;
			for(var j = 0; j < this.shapesCount; j++)
				if(this['_x' + j] < x + radius && this['_x'+j] > x - radius && this['_y' + j] < y + radius && this['_y' + j] < y + radius)
				{
					this.delPoint(j);
					j--;
				}
		}
		return this;
	}

	this.points=function(points)
	{
		var names = this.pointNames;
		if(points === undefined){
			points = [];
			for(var j = 0; j < this.shapesCount; j++)
			{
				points[j] = [];
				for(var i = 0; i < names.length; i++)
					points[j][i] = this[names[i] + j];
			}
			return points;
		}
		this.redraw();
		var oldCount = this.shapesCount;
		this.shapesCount = points.length;
		for(j = 0; j < this.shapesCount; j++)
			for(i = 0; i < names.length; i++)
				this[names[i] + j] = points[j][i];
		for(j = this.shapesCount; j < oldCount; j++)
			for(i = 0; i < names.length; i++)
				this[names[i] + j] = undefined;
		return this;
	}

	this._proto = 'lines';

}, 'shape', true);