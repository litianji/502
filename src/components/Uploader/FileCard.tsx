import { Avatar, Button, Flex, Space } from 'antd';
import { DownloadOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import './style.less';

type FileCardProps = {
  name: string;
  size?: number;
  type?: string;
  url?: string;
  onDelete?: () => void;
};

export const readableFileSize = (attachmentSize: number) => {
  const DEFAULT_SIZE = 0;
  const filesize = attachmentSize || DEFAULT_SIZE;
  if(!filesize) {
    return `${DEFAULT_SIZE} KB`;
  }

  const sizeInKb = filesize / 1024;

  if (sizeInKb < 1024) {
    return `${sizeInKb.toFixed(2)} KB`;
  } else {
    return `${(sizeInKb / 1024).toFixed(2)} MB`;
  }
};

export default (props: FileCardProps) => {
  const { name, size, type, url, onDelete } = props;

  return (
    <div className="file-info-card" onClick={e => e?.stopPropagation?.()}>
      <Flex justify='space-between' align='center'>
        <Space size={16}>
          <Avatar size={40} icon={<FileOutlined />} />
          <div className="file-info-content">
            <div>{ name }</div>
            <div className="file-info">{type} | {size && readableFileSize(size) }</div>
          </div>
        </Space>
        <Space>
          { onDelete && <Button shape='circle' icon={<DeleteOutlined />} onClick={onDelete} /> }
          { url && <a href={url} download={name}><Button shape='circle' icon={<DownloadOutlined />}/></a>}
        </Space>
      </Flex>
    </div>
  )
}