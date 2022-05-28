const canvas = document.querySelector('#canvas')
            const context = canvas.getContext('2d');
            let draw_tool = 'pen';
            let color = 'white';
            let alpha = 1;
            let tickness = 2;
            let x = 0, y = 0;
			
            const fake_canvas = document.querySelector('#fake_canvas');
            const ctx = fake_canvas.getContext('2d');
			let dx = 0, dy = 0;
			
            /* ----------------- РИСОВАНИЕ ------------------------ */
			
            canvas.addEventListener('mousedown', e => {
              e.preventDefault();
              x = e.offsetX;
              y = e.offsetY;
                
              context.strokeStyle = color;
			  context.fillStyle = color;
              context.globalAlpha = alpha;
              context.lineWidth = tickness;
			  context.beginPath();
              context.moveTo(x,y);
                
			  ctx.strokeStyle = color;
              ctx.fillStyle = color;
			  ctx.lineWidth = tickness;
			  ctx.beginPath();  
                
			  canvas.addEventListener('mousemove', draw);
              fake_canvas.addEventListener('mousemove', draw);     
              window.addEventListener('mouseup', draw_end); 
            
            });

            function draw(e){
                e.preventDefault();
            
                if(draw_tool == 'pen' || draw_tool == 'marker') {
				    x = e.offsetX;
                    y = e.offsetY;
				    context.lineTo(x,y);
                    context.stroke();
                }
                
                else if(draw_tool == 'eraser'){
				    x = e.offsetX;
                    y = e.offsetY;
				    context.globalCompositeOperation = 'destination-out';
				    context.moveTo(x,y);
                    context.arc(x, y, tickness * 3, 0, Math.PI*2, false); 
                    context.fill(); 
				    context.globalCompositeOperation = "source-over";
                }
                
				else if(draw_tool == 'rectangle'){
					ctx.clearRect(0, 0, fake_canvas.width, fake_canvas.height);
					fake_canvas.style.display = 'block';
					dx = e.offsetX - x;
					dy = e.offsetY - y;
					ctx.strokeRect(x,y,dx,dy);
				}
                
                else if(draw_tool == 'circle'){
                    ctx.clearRect(0, 0, fake_canvas.width, fake_canvas.height);
					fake_canvas.style.display = 'block';
                    dx = e.offsetX - x;
					dy = e.offsetY - y;
                    ctx.arc(x, y, Math.abs(dx), 0, Math.PI*2, false);
                    ctx.fill();
                }
                
                else if(draw_tool == 'line'){
                    ctx.clearRect(0, 0, fake_canvas.width, fake_canvas.height);
					fake_canvas.style.display = 'block';
					dx = e.offsetX;
					dy = e.offsetY
                    ctx.moveTo(x,y);
                    ctx.lineTo(dx,dy);
                    //ctx.stroke();
                }
            };

            function draw_end(e){
				context.closePath();
                ctx.closePath();
                
                if(draw_tool == 'rectangle'){
                    context.strokeRect(x,y,dx,dy);
                }
                else if(draw_tool == 'circle'){ 
                    context.arc(x, y, Math.abs(dx), 0, Math.PI*2, false);
                    context.fill();
                }
                else if(draw_tool == 'line'){
                    context.lineTo(dx,dy);
                    context.stroke();
                }
                
                fake_canvas.style.display = 'none';
                x,y,dx,dy = 0; 
                
				canvas.removeEventListener('mousemove', draw);
                fake_canvas.removeEventListener('mousemove', draw);
                window.removeEventListener('mouseup', draw_end);
            };


            /* ----------------- Обработчики МЕНЮ ------------------------ */
            
            const menu = document.querySelectorAll('#menu img');
            const pen = document.querySelector('#pen');
            const pen_tools = Array.prototype.slice.call(pen.querySelectorAll('img'));
            const pen_blocks = Array.prototype.slice.call(document.querySelectorAll('.pen'));
            const text = document.querySelector('#text');
            const text_blocks = Array.prototype.slice.call(document.querySelectorAll('.text'));
            const figure = document.querySelector('#figure');
            
            menu[2].addEventListener('click', function(e){
                this.src = 'https://s3.amazonaws.com/appforest_uf/f1653490871313x817423761897405800/pen.svg';
                menu[3].src = 'https://s3.amazonaws.com/appforest_uf/f1653489910216x936638997431530600/text.svg';
                menu[4].src = 'https://s3.amazonaws.com/appforest_uf/f1653489223720x327272435910322500/figure.svg';
                text_blocks.forEach(item => item.style.display = 'none');
                figure.style.display = 'none';
                pen.style.display = 'flex';
            });
            
            menu[3].addEventListener('click', function(e){
                this.src = 'https://s3.amazonaws.com/appforest_uf/f1653490914298x949575297318815400/text.svg';
                menu[2].src = 'https://s3.amazonaws.com/appforest_uf/f1653489717858x362248368646471040/pen.svg';
                menu[4].src = 'https://s3.amazonaws.com/appforest_uf/f1653489223720x327272435910322500/figure.svg';
                pen_blocks.forEach(item => item.style.display = 'none');
                text.style.display = 'flex';
                draw_tool = 'text';
                alpha = 1;
                canvas.addEventListener('click', show_text);
            })
            
            menu[4].addEventListener('click', function(e){
                this.src = 'https://s3.amazonaws.com/appforest_uf/f1653597619401x395219885148264260/figure.svg';
                menu[2].src = 'https://s3.amazonaws.com/appforest_uf/f1653489717858x362248368646471040/pen.svg';
                menu[3].src = 'https://s3.amazonaws.com/appforest_uf/f1653489910216x936638997431530600/text.svg';
                pen_blocks.forEach(item => item.style.display = 'none');
				draw_tool = 'rectangle';
                alpha = 1;
                if(figure.style.display == 'flex') figure.style.display = 'none';
                else figure.style.display = 'flex';
			})
            
            
            pen_tools.forEach((item) =>{
                item.addEventListener('click', pen_switch);
            });
           
            function pen_switch(e){
                e.preventDefault();
				let tick = document.querySelector('#tickness');
				let color = document.querySelector('#color');
   
				if(this == pen_tools[0]){
                    pen_blocks.forEach(item => item.style.display = 'none');
                }
                   
                else if(this == pen_tools[1]){
                    draw_tool = 'pen';
                    alpha = 1;
                }   
                
                else if(this == pen_tools[2]){
                    draw_tool = 'marker';
                    alpha = 0.01;
                }
                
                else if(this == pen_tools[3]){
                    draw_tool = 'eraser';
                    alpha = 1;
                }
                
                else if(this == pen_tools[4]){
					color.style.display = 'none';
                    if(tick.style.display == 'block') tick.style.display = 'none';
                    else tick.style.display = 'block';
                }
                
                else if(this == pen_tools[5]){
					tick.style.display = 'none';
                    if(color.style.display == 'flex') color.style.display = 'none';
                    else color.style.display = 'flex';
                }
            }
            
             // Ползунок Thickness 
        
            const ticker = document.querySelector('#tickness');
            const size = parseInt(document.querySelector('#tickness hr').width);
            const switcher = document.querySelector('#tickness img');
            switcher.ondragstart = function() {
              return false;
            };
            
            switcher.addEventListener('mousedown', e =>{
                event.preventDefault(); 
                document.addEventListener('mousemove', shift);
                window.addEventListener('mouseup', function stop(e) {
                    document.removeEventListener('mousemove', shift);
                    window.removeEventListener('mouseup', stop );
                });
                
            });
            
            
            function shift(e){
				e.preventDefault();
                let x = e.clientX - ticker.getBoundingClientRect().left - 6;
                if(x < 16) x = 16;
                if(x > size) x = size;
                tickness = Math.round(x / 10);
                switcher.style.left = x + 'px';
            }
            
            
            // Палитра рисования
            
            let palette = ['#000', '#9c9595', '#d0cfcf', '#fff', '#d24545', '#f8d244', '#56c383', '#5a65ca', '#fa9494', '#fdff88', '#a2ff93', '#b4b2ff'];
            let colors = Array.prototype.slice.call(document.querySelectorAll('#color img'));
            colors.forEach((item,i) =>{
                item.addEventListener('click', e => {
					e.preventDefault();
                    pen_tools[5].src = item.src;
                    color = palette[i];
                });
            });
            
                
            // Фигуры
            const figure_tools = Array.prototype.slice.call(figure.querySelectorAll('img'));
            
            figure_tools.forEach((item) =>{
                item.addEventListener('click', figure_select); 
            });
            
            function figure_select(e){
                e.preventDefault();
                
                switch(this){
                    case figure_tools[0]:
                        draw_tool = 'rectangle';
                    break;    
                    case figure_tools[6]:
                        draw_tool = 'circle';
                    break;
                    case figure_tools[8]:
                        draw_tool = 'line';
                }
                    
            }
            
             
            // -------------- ТЕКСТ ----------------------------------------------
            
            const text_tools = Array.prototype.slice.call(text.querySelectorAll('img'));
            const font_colors = Array.prototype.slice.call(document.querySelectorAll('#f_color img'));
            const user_text = document.querySelector('#user_text');
            let words = '';
            let f_color = 'white';
            user_text.style.color = f_color;
            let f_bold = '', f_italic = '', f_size = 14, f_family = 'sans-serif';
            
             font_colors.forEach((item,i) =>{
                item.addEventListener('click', e => {
					e.preventDefault();
                    text_tools[12].src = item.src;
                    f_color = palette[i];
                    user_text.style.color = f_color;
                });
            });
            
            text_tools.forEach(item =>{
                item.addEventListener('click', text_switch);
            })


            function text_switch(e){
                switch(this){
                    case text_tools[0]:
                        f_size--;
                    break;
                    case text_tools[1]:
                        //some code
                    break;
                    case text_tools[2]:
                        f_size++;
                    break;
                    case text_tools[4]:
                        f_bold = (f_bold == '') ? 'bold' : '';
                        this.style.borderBottom = (this.style.borderBottom == '2px solid blue') ? 'none' : '2px solid blue';
                    break;
                    case text_tools[6]:
                        f_italic = (f_italic == '') ? 'italic' : '';
                        this.style.borderBottom = (this.style.borderBottom == '2px solid blue') ? 'none' : '2px solid blue';
                    break; 
                    case text_tools[12]:
                        let color = document.querySelector('#f_color');
                        color.style.display = (color.style.display == 'flex') ? 'none' : 'flex';
                    break;
                    case text_tools[14]:
                        text_blocks.forEach(item => item.style.display = 'none');
                        user_text.value = null;
                        draw_tool = '';
                    case text_tools[15]:
                        words = user_text.value;
                        text_draw();
                        words = '';
                        user_text.style.display = 'none';
                        user_text.value = null;
                        canvas.addEventListener('click', show_text);
                }
                user_text.style.font = `${f_bold} ${f_italic} ${f_size}px ${f_family}`;
            }
            
            // Рисование текста и рамки
            
            function enable_text(){
                document.addEventListener('keydown', text_draw);
                fake_canvas.addEventListener('mousedown', text_rect_start);
            }
            
            function disable_text(){
                document.removeEventListener('keydown', text_draw);
                fake_canvas.removeEventListener('mousedown', text_rect_start);
            }
            
            function text_rect_start(){
                e.preventDefault();
                x = e.offsetX;
                y = e.offsetY;
                ctx.strokeStyle = 'blue';
                ctx.fillStyle = f_color;
                ctx.lineWidth = 2;
                ctx.beginPath(); 
                
                fake_canvas.addEventListener('mousemove', text_rect_draw);
                window.addEventListener('mouseup', text_rect_end);
            }
            
            function text_rect_draw(e){
                
                ctx.clearRect(0, 0, fake_canvas.width, fake_canvas.height);
				fake_canvas.style.display = 'block';
				dx = e.offsetX - x;
				dy = e.offsetY - y;
				ctx.strokeRect(x,y,dx,dy);
                
            }
            
            function text_rect_end(){
                fake_canvas.removeEventListener('mousemove', text_rect_draw);
                window.removeEventListener('mouseup', text_rect_end);
            }
            
            // Textarea    
            let t_x, t_y
            function show_text(e){
                if(draw_tool != 'text') return;
                t_x = e.offsetX;
                t_y = e.offsetY;
                user_text.style.marginLeft = t_x + 'px';
                user_text.style.marginTop = t_y + 'px';
                user_text.style.display = 'block';
                //canvas.removeEventListener('click', show_text);
            };
            
            user_text.ondragstart = function(){
                return false;
            }
            
            // Рисование полученного текста на холсте
            function text_draw(){
                context.fillStyle = f_color;
                context.font = `${f_bold} ${f_italic} ${f_size}px ${f_family}`;
                let count = words.split('\n').length - 1;
                if(count < 1) context.fillText(words, t_x + 3, t_y + f_size + 2);
                else {
                    let string = '';
                    let start = 0;
                    words = words.split('');
                    words.push('\n');
                    for(let i = 0; i < words.length; i++) {
                        if(words[i] == '\n'){
                            string = words.slice(start, i + 1).join('');
                            context.fillText(string, t_x + 3, t_y + f_size + 4);
                            start = i + 1;
                            t_y += f_size + 1;
                        }
                    }
                }
          
            };
            