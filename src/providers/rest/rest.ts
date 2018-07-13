
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class RestProvider {
 

//Variables

 private options : any;
 private headersParams: any;
 private vimeoURl:string;

 //Fin Variables

 constructor(public http: HttpClient) {

  this.vimeoURl = "https://api.vimeo.com";



  this.headersParams =
   {
        "Content-Type": "application/json",
        "Accept": "application/vnd.vimeo.*+json;version=3.4",
        "Authorization": "Bearer 08093dbf7ad01a80be3218b4201ad054"
    };

 }

 //Fin Constructor


/**
 * Funcion que realiza un http Post request, que retorna los permisos y formulario, para hacer un upload de un video a vimeo.
 * @param videoInfo informacion para subir el video (nombre,descripcion).
 */
  uploadVideo(videoInfo){

    this.options={

      headers: this.headersParams,
      body: 
      JSON.stringify({

        upload:
        {
            approach:"post",
            redirect_url:"http://localhost:8100"
        },
        name : videoInfo.videoName,
        description:videoInfo.description,
        size: 2000,
        embed:
        {
          buttons:
          {
            embed:false,
            fullscreen:true,
            hd:false,
            like:true,
            share:false,
            watchlater:false
          },
        playbar:false,
        title:
          {
          name:"show",
          owner:"hide",
          portrait:"hide"
          },
        privacy:
          {
          download:false,
          embed:"private",
          view:"nobody"
          }
      }
      })
   }
    return this.http.post<any>(this.vimeoURl +"/me/videos",this.options.body,this.options)
   }

   /**
    * Funcion que realiza un http get request a vimeo Api, que trae como resultado los videos de la galeria CunApp
    */
  getVideos()
  {
    this.options ={

      headers: this.headersParams

    }
    return this.http.get(this.vimeoURl + "/me/albums/5273466/videos",this.options)
  }

 

  getComments(URI){
    this.options ={

      headers: this.headersParams

    }
    return this.http.get(this.vimeoURl + URI,this.options)
  }
  postComment(videoId,comment:string){
    this.options={

      headers: this.headersParams,
      body: 
      JSON.stringify({
       text:comment
      })
   }
    return this.http.post<any>(this.vimeoURl +"/videos/" + videoId + "/comments",this.options.body,this.options)
   }
 

  
}
