import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faImage, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Meteor } from 'meteor/meteor';

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
  overflow: 'auto',
  margin: 0,
  padding: 10,
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
  position: 'fixed',
  right: 10,
  top: 10,
  height: 40,
  color: 'white',
  border: 0,
  height: 48,
  padding: '0 30px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  borderRadius: 3
}
const resultContainer = {
  height: 476,
  overflow: 'auto'
}
const resultRow = {
  display: 'flex',
  justifyContent: 'space-between',
  lineHeight: '40px',
  borderBottom: '1px dashed #ccc',
  paddingLeft: 10,
  paddingRight: 10,
}

const resultText = {
  flexGrow: 1
}

const resultConfidence = {
  width: 60,
}
export default class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedFiles: [],
      selectedIndex: -1,
      selectedFile: null,
      base64Images: [],
      selectedBase64: [],
      analyseResult: [],
    };
  }

  uploadFiles(files){
    const context = this;
    console.log(files);
		S3.upload({
				files: files,
				path: "files/"
			},function(e,r){
        if(typeof(r._id) !== 'undefined' ) {
          const { uploadedFiles } = context.state;
          console.log(r);
          context.setState({ uploadedFiles: [...uploadedFiles, r]})
        }
		});
  }

  is_analysed = (selectedIndex) => {
    const { analyseResult } = this.state;
    let i_index = -1;
    analyseResult.forEach((item, index) => {
      if(item.index === selectedIndex) {
        i_index = index;
        return;
      }
    });
    if(i_index >= 0) {
      return true;
    } else {
      return false;
    } 
  }

  clickFile = (index) => {
    const { uploadedFiles, base64Images } = this.state;
    this.setState({selectedIndex: index, selectedFile: uploadedFiles[index], selectedBase64: base64Images[index]});
  }

  onAnalyse = () => {
    const { selectedFile, analyseResult, selectedIndex } = this.state;
    const context = this;
    Meteor.call('analyseImage', { S3File: selectedFile }, (error, result) => {
      console.log(error, result);
      let i_index = -1;
      analyseResult.forEach((item, index) => {
        if(item.index === selectedIndex) {
          i_index = index;
          return;
        }
      });
      if(i_index >= 0) {
        analyseResult[i_index].result = result;
      } else {
        analyseResult.push({
          index: selectedIndex,
          result: result
        });
      }
      context.setState({analyseResult: analyseResult});
    });
  }

  render() {
    const { selectedIndex, uploadedFiles, selectedFile, analyseResult } = this.state;
    const context = this;
    let i_index = -1;
    analyseResult.forEach((item, index) => {
      if(item.index === selectedIndex) {
        i_index = index;
        return;
      }
    });
    const width = window.innerWidth - 602;
    const height= 520;

    let analyseObj = null;
    if(i_index >= 0) {
      analyseObj = analyseResult[i_index];
    }
    console.log('analyseObj',analyseObj);
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
                      {(context.is_analysed(i)) && (
                        <FontAwesomeIcon icon={faCheck} style={{float: 'right', marginRight: 10, marginTop: 10}} />
                      )}
                    </div>; 
                  } else {
                    return <div className={"row "} onClick={()=>context.clickFile(i)} style={fileSelectedRow} key={i}> 
                      <FontAwesomeIcon icon={faImage} style={{marginRight: 10}} />
                      {object.file.original_name}
                      {(context.is_analysed(i)) && (
                        <FontAwesomeIcon icon={faCheck} style={{float: 'right', marginRight: 10, marginTop: 10}} />
                      )}
                    </div>; 
                  }
                })}
              </div>
          </div>
          <div style={imagePreview}>
              {(selectedFile) && (
                <img src={selectedFile.secure_url} alt="uploaded image" width='100%' />
              )}
              <button style={btnAnalyse} onClick={()=>context.onAnalyse()}>Analyse</button>
          </div>
          <div style={informationContainer}>
            <div style={fileListHeader}> Analyse Result </div>
            <div style={resultContainer}>
              {(analyseObj) && (analyseObj.result.TextDetections.map(function(obj, i) {
                return <div style={resultRow}  key={i}>
                    <label style={resultText}>{obj.DetectedText}</label>
                    <span style={resultConfidence}>{obj.Confidence.toFixed(2)}</span>
                  </div>;
              }))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
