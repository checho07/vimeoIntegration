

import { Component} from '@angular/core';
import { ModalController, Modal } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { LoadingController } from 'ionic-angular';
import { AlertController,ToastController  } from 'ionic-angular';
//import { VideoCapturePlusOptions, VideoCapturePlus } from '@ionic-native/video-capture-plus';
 
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
  public inputTus;
  public progress = "0";
  
  
public videoInfo ={
nombre:"",descripcion:"",size:''
};

  constructor(

     public rest: RestProvider,
     public mediaCapture: MediaCapture,
     public loading: LoadingController,
     public modalCtrl: ModalController,
     private alertCtr: AlertController,
     private toastCtrl: ToastController,
    // private videoCapturePlus: VideoCapturePlus
    )
    { 
       this.getVideos()  
    }
  
  ionViewDidLoad()
  { 
    
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
             this.progress = "50";
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
         if (!(data.videoName === "" && data.description === "") ) {
           this.videoInfo.nombre = data.videoName;
           this.videoInfo.descripcion =data.description;
           this.recordVideo();
          
          
         } else {
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
         }
       }
    }
  ]
});
alert.present();
      
  }

// recordVideoHD(){
//   const options: VideoCapturePlusOptions = {
//     limit: 1,
//     duration:10,
//     highquality: true,
//     portraitOverlay: 'assets/img/',
//     landscapeOverlay: 'assets/img/camera/overlay/landscape.png'
//  } 
//  this.videoCapturePlus.captureVideo(options).then((mediafile: MediaFile[]) => console.log(mediafile), error => console.log('Something went wrong'));
// }
recordVideo()
{

    let options: CaptureVideoOptions = { limit: 1,duration:10,quality:100};
 
    this.mediaCapture.captureVideo(options)
    .then((data: MediaFile[]) => data.forEach(element => {
      document.getElementById('back').style.backgroundColor = "rgba(0,0,0,0.4)";
        this.hideBtnModal= true;
        this.showBtnGaleria = false;
        this.hideContent = true;  
        // let btnGaleria = document.getElementById("btnGaleria")
        // btnGaleria.click(); 
       //document.getElementsByTagName('input')[1].value = "";
       
      
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
  
    var inputFile =document.getElementById("tusInput");    
    inputFile.click();
    
}

requestPOSTTus(videoInfo):void{

  let loader = this.loading.create({content: 'Obteniendo Enlace para Subir Video...',});
  loader.present().then(() => 
  {
  
      this.rest.POST_tus(videoInfo).subscribe(result => 
        {
  
          let loader1 = this.loading.create({content: 'Subiendo Video...',});
          loader1.present().then(()=>{
            this.resPOST = result
            let inputTus = document.getElementById('tusInput');
         
               this.rest.PatchVideo(inputTus['files'][0],this.resPOST.upload.upload_link).subscribe(res =>{
                
                 if (res) {
                  loader1.dismiss(); 
                  let toast = this.toastCtrl.create({
                    message: 'Tu video pasara a revision y sera publicado',
                    duration: 3000,
                    position: 'bottom'
                  }); 
                  toast.onDidDismiss(() => {
                    this.hideContent = false;
                    this.showBtnGaleria = true;
                    this.hideBtnModal = false;
                  });
                
                  toast.present();
                  
                 }
               })
               
          })
         
          loader.dismiss();
        
        },
      error => {
          alert(<any>error.message);
          console.log("requestPOSTError: " + error.message);
      }
  );

 
  
  });
}


//  requestPOST (videoInfo): void 
//  {
  
//   //let embed = document.getElementById("embed");

//   let loader = this.loading.create({content: 'Obteniendo Enlace para Subir Video...',});
 
//   loader.present().then(() => 
//   {
//       this.rest.uploadVideo(videoInfo).subscribe(result => 
//         {
//         this.resPOST = result;
       
//         //embed.innerHTML= this.resPOST.upload.form;
//         this.recordVideo();
//         },
//       error => {
//           alert(<any>error.message);
//           console.log("requestPOSTError: " + error.message);
//       }
//   );

//    loader.dismiss();  
  
//   });
// } 



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
OnchangeInput(video) {
  
   
  const videoFile = video.target.files[0];
  this.videoInfo.size = videoFile.size;
  
  this.requestPOSTTus(this.videoInfo)
 }



}