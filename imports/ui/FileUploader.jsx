import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faImage } from "@fortawesome/free-solid-svg-icons";

const imageContainer = {
  width: 'calc(100% - 45px)',
  padding:20,
  margin: '0 0 20px 0',
  background: '#ddd',
  border: '2px dashed #ccc',
  textAlign: 'center'
};
const imagePreview = {
  flexGrow: 1,
  height: 520,
  margin: 0,
  border: '2px dashed #ccc',
  position: 'relative',
}
const mainContainer = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
}
const fileListContainer = {
  width: '300px',
  borderTop: '2px dashed #ccc',
  borderLeft: '2px dashed #ccc',
  borderBottom: '2px dashed #ccc',
}
const informationContainer = {
  width: '300px',
  borderTop: '2px dashed #ccc',
  borderRight: '2px dashed #ccc',
  borderBottom: '2px dashed #ccc',
}

const fileListHeader = {
  height: 40,
  margin: 2,
  backgroundColor: '#33b5e5',
  lineHeight: '40px',
  textAlign: 'center',
  color: 'white'

}

const fileRow = {
  height: 40,
  lineHeight: '40px',
  margin: 2,
  borderBottom: '1px dashed #ccc',
  paddingLeft: 10
}
const fileList = {
  height: 476,
  overflow: 'auto'
}
const fileSelectedRow = {
  height: 40,
  lineHeight: '40px',
  margin: 2,
  borderBottom: '1px dashed #ccc',
  backgroundColor: '#eee',
  color: '#00f',
  paddingLeft: 10
}

const btnAnalyse = {
  position: 'absolute',
  right: 10,
  bottom: 10,
  height: 40,
}

export default class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      selectedIndex: -1,
      selectedFile: null,
    };
  }
  uploadFiles(files){
    // var files = $("input.file_bag")[0].files
    console.log(files);
    const context = this;
		S3.upload({
				files:files,
				path:"files"
			},function(e,r){
        if(typeof(r._id) !== 'undefined' ) {
          const { uploadedFiles } = context.state;
          console.log(r);
          context.setState({ uploadedFiles: [...uploadedFiles, r]})
        }
		});
  }

  clickFile = (index) => {
    const { uploadedFiles } = this.state;
    this.setState({selectedIndex: index, selectedFile: uploadedFiles[index]});
  }

  onAnalyse = () => {

  }

  render() {
    const { selectedIndex, uploadedFiles, selectedFile } = this.state;
    const context = this;
    return (
      <div>
        <Dropzone onDrop={acceptedFiles => this.uploadFiles(acceptedFiles)}>
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()} style={imageContainer}>
                <input {...getInputProps()} />
                <FontAwesomeIcon icon={faCloudUploadAlt} style={{fontSize: '4em'}} />          
                <p>Drag and drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
        <div  style={mainContainer}>
          <div style={fileListContainer}>
            <div style={fileListHeader}> File List </div>
            <div style={fileList}>
              {uploadedFiles.length > 0 && uploadedFiles.map(function(object, i){
                  if(selectedIndex !== i) {
                    return <div className={"row "} onClick={()=>context.clickFile(i)} style={fileRow} key={i}> 
                      <FontAwesomeIcon icon={faImage} style={{marginRight: 10}} />
                      {object.file.original_name}
                    </div>; 
                  } else {
                    return <div className={"row "} onClick={()=>context.clickFile(i)} style={fileSelectedRow} key={i}> 
                      <FontAwesomeIcon icon={faImage} />
                      {object.file.original_name}
                    </div>; 
                  }
                })}
              </div>
          </div>
          <div style={imagePreview}>
              {(selectedFile) && (
                <img src={selectedFile.secure_url} alt="uploaded image" />
              )}
              <button style={btnAnalyse} onClick={()=>context.onAnalyse()}>Analyse</button>
          </div>
          <div style={informationContainer}>&nbsp;</div>
        </div>
      </div>
    )
  }
}
