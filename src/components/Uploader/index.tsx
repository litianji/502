import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { useState } from 'react';
import FileCard from './FileCard';

const { Dragger } = Upload;

type UploaderProps = {
  onChange?: (file: RcFile) => void;
  onDelete?: () => void;
  text?: string;
  hint?: string;
}

export default (props: UploaderProps) => {
  const { 
    onChange, 
    onDelete, 
    text = 'Click or drag file to this area to upload', 
    hint
  } = props;
  const [file, setFile] = useState<RcFile>();

  return (
    <Dragger
      accept='.ttf'
      showUploadList={false}
      beforeUpload={file => {
        setFile(file);
        onChange?.(file);
        return false;
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{text}</p>
      {hint && <p className="ant-upload-hint">{hint}</p>}
      {
        file && (
          <FileCard 
            name={file.name} 
            size={file.size} 
            type={file.type || file.name.replace(/.*\.(\w+)$/, '$1')} 
            onDelete={() => {
              setFile(undefined);
              onDelete?.();
            }}/>
          )
      }
    </Dragger>
  )
}