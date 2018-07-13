

import { Component} from '@angular/core';
import { ModalController, Modal } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //variables //
  private resPOST :any;
  public showForm =true;
  public showBtnGaleria = true;
  public hideBtnModal = false;
  public videoRes:any;
  public videoList:any;
  public hideContent = false; 
  public hideForm = true;

videoInfo ={
nombre:"",descripcion:"",likes:"",commments:"",fechaCreacion:""
};

  constructor(

     public rest: RestProvider,
     public mediaCapture: MediaCapture,
     public loading: LoadingController,
     public modalCtrl: ModalController,
     private alertCtr: AlertController,
    ){  this.getVideos()
     
    }
  
  ionViewDidLoad()
  { 
 
    var inputFile =document.getElementById("file");  
    let showBtnGaleria = true;
     this.showBtnGaleria = showBtnGaleria;
    let hideForm = true; 
     this.hideForm = hideForm;
    inputFile.onchange = function(){
      
      showBtnGaleria = true;
      hideForm = false;
      var x = {value:""};
      x.value = this['files'][0].name;
      alert(x.value);
    }
  }

  
  getVideos()
  {

    let loader = this.loading.create({content: 'Cargando Pagina...'});
    let loader1 = this.loading.create({content: 'Cargando los ultimos videos...'});

   loader.present().then(() => {

      this.rest.getVideos().subscribe(result =>
          {

            loader1.present().then(()=>
            {
              this.videoRes = result;
              this.videoList = this.videoRes.data;
             
             console.log(this.videoList);
         })        

          },
        error => {
            alert(<any>error);
            console.log("getVideosError: " +error)
        },() =>
        {

          loader1.dismiss();
          loader.dismiss();
           
       
        }
       
    );
       
    });
  }




  addVideo()
  {

let alert = this.alertCtr.create({
  title: 'Datos de tu video',
  inputs: [
    {
      name: 'videoName',
      placeholder: 'Titulo de tu video'
    },
    {
      name: 'description',
      placeholder: 'Descripcion y tu correo',
      type: 'text'
      
    }
  ],
  buttons: [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: data => {
         
      }
    },
    {
      text: 'Grabar',
      handler: data => {
         if (data.videoName === "" && data.description === "" ) {
           
           let alert = this.alertCtr.create({
            title: 'Faltan Datos',
            subTitle: 'por favor brindanos un titulo y una descripcion para tu video, y si quieres tu correo',
            buttons:[{
              text:'Ok',
              role:'cancel',
              handler:() =>{this.addVideo()}
            }]

          });
          alert.present();
          
         } else {
           this.requestPOST(data);
         }
       }
    }
  ]
});
alert.present();
      
  }

recordVideo()
{

    let options: CaptureVideoOptions = { limit: 1,duration:10,quality:0};
 
    this.mediaCapture.captureVideo(options)
    .then((data: MediaFile[]) => data.forEach(element => {
      document.getElementById('back').style.backgroundColor = "rgba(0,0,0,0.4)";
        this.hideBtnModal= true;
        this.showBtnGaleria = false;
        this.hideContent = true;  
        // let btnGaleria = document.getElementById("btnGaleria")
        // btnGaleria.click(); 
       document.getElementsByTagName('input')[1].value = "";
       
      
      }),
      (err: CaptureError) => 
      {
        console.log("recordVideoError: " + err);
        document.getElementsByTagName('input')[1].value = "";
        let alert = this.alertCtr.create({
          title: 'Error al abrir camara',
          message: err.toString(),
          buttons: ['OK']
        });
        alert.present();
      }
    );
}

openGallery()
{
  
    var inputFile =document.getElementById("file");    
    inputFile.click();
    
}




 requestPOST (videoInfo): void 
 {
  
  let embed = document.getElementById("embed");

  let loader = this.loading.create({content: 'Obteniendo Enlace para Subir Video...',});
 
  loader.present().then(() => 
  {
      this.rest.uploadVideo(videoInfo).subscribe(result => 
        {
        this.resPOST = result;
       
        embed.innerHTML= this.resPOST.upload.form;
        this.recordVideo();
        },
      error => {
          alert(<any>error.message);
          console.log("requestPOSTError: " + error.message);
      }
  );

   loader.dismiss();  
  
  });
} 



showLoading(){
  let loader = this.loading.create({
    content: 'Subiendo Video...',
    dismissOnPageChange: true,
    duration:5000
  });
  loader.present();
  
}

openCommentsModal(videoInfo) {
  
  const modalComments:Modal = this.modalCtrl.create('ModalCommentsPage',{videoInfo});
      modalComments.present();
      modalComments.onDidDismiss(()=>{
     this.getVideos();     
    })

  // this.rest.getComments(videoInfo.uri).subscribe(comments =>{
    
  //   commentsData = comments

  //   let dataObj = {
  //     commentsData:commentsData.data,
  //     videoId:videoInfo.uri.split('/')[2]

  //   }

  //   const modalComments:Modal = this.modalCtrl.create('ModalCommentsPage',{dataObj});
  //     modalComments.present();
  //     modalComments.onDidDismiss((data)=>{
  //     console.log(data);
     
  //   })
  // },
  // error => {
  //     alert(<any>error.message);
  //     console.log("GetCommentsError: " + error.message);
  // })
      
}



}