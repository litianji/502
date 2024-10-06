import { useMemo, useState, useRef } from 'react';
import { Font } from 'fonteditor-core';
import Uploader from  '@/components/Uploader';
import { RcFile } from 'antd/es/upload';
import { Button, Input, Space, Flex, Select, Divider, Popover, Typography, message } from 'antd';
import { minify } from './minify';
import FileCard, { readableFileSize } from '@/components/Uploader/FileCard';
import { ScissorOutlined, ArrowRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import charData from './data';
import './style.less';

const { Text } = Typography;

const DEFAULT_TEXT = '删除掉不需要的文字压缩字体文件';

const readBuffer = (file: RcFile) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default () => {
  const defaultTextRef = useRef<HTMLInputElement>(null);
  const [minifyFont, setMinifyFont] = useState<{ url?: string, size?: number, blob?: Blob, fileName?: string }>({});
  const [fontFile, setFontFile] = useState<RcFile>();
  const [customText, setCustomText] = useState<string>(DEFAULT_TEXT);
  const [selectValue, setSelectValue] = useState<string[]>(['baseText']);

  const createFontFace = (path: string) => {
    let style = document.head.querySelector('#fontFaceDemo');
    if(!style) {
      style = document.createElement('style');
      style.id = 'fontFaceDemo';
      document.head.appendChild(style);
    }
    style.innerHTML = `@font-face {
      font-family: 'MyFont';
      src: url(${path});
    }`;
  }

  const onChange = (file: RcFile) => {
    setFontFile(file);
    const dataUrl = URL.createObjectURL(file);
    createFontFace(dataUrl)
  }

  const createNewFileName = () => {
    const fontName = fontFile?.name.replace(/(.*)\.(\w+)$/, '$1');
    const fileName = `${fontName}-${new Date().getTime()}.ttf`;
    return fileName;
  }

  const handleClick = async () => {
    if(!fontFile) {
      message.warning('请先上传字体文件！');
      return;
    }

    const arrayBuffer = await readBuffer(fontFile);
    const font = Font.create(arrayBuffer, {
      // support ttf, woff, woff2, eot, otf, svg
      type: 'ttf',
      // only read `a`, `b` glyphs
      // subset: [65, 66],
      // read font hinting tables, default false
      hinting: true,
      // read font kerning tables, default false
      kerning: true,
      // transform ttf compound glyph to simple
      compound2simple: true,
      // inflate function for woff
      inflate: undefined,
      // for svg path
      combinePath: false,
    })
    const fontObject = font.get();


    if(fontObject) {
      // 选中的top最大值
      const topNum = +selectValue.filter(item => item !== 'baseText').sort((a, b) => +b - +a)[0] || 0;
      const charDataText = charData.slice(0, topNum).map(item => item.char).join('');

      const buffer = minify(fontObject, {
        text: defaultTextRef.current?.innerText + charDataText,
        basicText: true,
      });
      const blob = new Blob([buffer]);
      const dataUrl = URL.createObjectURL(blob);

      console.log(blob.size, topNum, charDataText);

      createFontFace(dataUrl);
      setMinifyFont({
        url: dataUrl,
        size: blob.size,
        blob,
        fileName: createNewFileName(),
      });
    }

  }

  const onClear = () => {
    setMinifyFont({});
    setFontFile(undefined);
    setCustomText(DEFAULT_TEXT);
    setSelectValue(['baseText']);
  }

  const percentile = useMemo(() => {
    const topNum = +selectValue.filter(item => item !== 'baseText').sort((a, b) => +b - +a)[0] || 0;
    if(!topNum) {
      return '';
    }
    const percent = charData[topNum + 1].percentile;
    return (+percent).toFixed(2) + '%';
  }, [selectValue]);

  return (
    <div className="font-crop">
      <div style={{ margin: '0 auto', width: '600px' }}>

        <div className="font-uploader">
          <Uploader
            text="点击或拖拽字体文件到此区域"
            hint='暂时只支持ttf，点击裁剪会在本地完成并不会上传，可能会有点卡顿'
            onChange={onChange}
            onDelete={onClear}
          />
        </div>

        <Flex>
          <div className="font-select-card">
            <div className="title">
              <Flex justify='space-between'>
                <span>添加自定义文字集</span>
                <Popover
                  content={
                    <div style={{ width: '300px' }}>
                      <Text>
                        可以把网页中的文字复制到此处，然后点击裁剪，字体文件中就会包含这些文字。可以通过<Text code>document.body.innerText</Text>获取文字，考虑到后续可能会新增文字，可以在常用文字集中选择一个文字集一起打包
                      </Text>  
                    </div>
                  }
                  title='自定义文字集'
                  trigger="click"
                >
                  <InfoCircleOutlined style={{ color: '#aaa' }}/>
                </Popover>
              </Flex>
            </div>
            <div className="body">
              <Input placeholder='请输入文字' onChange={e => setCustomText(e.target.value)} />
            </div>
          </div>

          <div className="font-select-card">
            <div className="title">
              <Flex justify='space-between'>
                <span>添加常用文字集 {percentile}</span>
                <Popover
                  content={
                    <div style={{ width: '300px' }}>
                      研究表明，3500个常用汉字即可覆盖日常使用汉字的 99%。
                    </div>
                  }
                  title='常用文字集'
                  trigger="click"
                >
                  <InfoCircleOutlined style={{ color: '#aaa' }}/>
                </Popover>
              </Flex>
            </div>
            <div className="body">
              <Select
                mode='multiple'
                value={selectValue}
                onChange={setSelectValue}
                defaultValue={['baseText']}
                style={{ width: '100%' }}
                placeholder="选择常用文字集"
                options={[
                  { value: 'baseText', label: '基础文本', disabled: true },
                  { value: '500', label: 'top 500', },
                  { value: '1000', label: 'top 1000', },
                  { value: '2500', label: 'top 2500', },
                  { value: '3500', label: 'top 3500', },
                ]}
              />
            </div>
          </div>
        </Flex>

        <div className="default-text" ref={defaultTextRef}>
          {customText ? customText : DEFAULT_TEXT}
        </div>

        <Flex justify='space-between' style={{ marginTop: '15px' }} className='font-crop-footer'>
          {
            fontFile?.size && minifyFont?.size ?
            <Space size={0}>
              <div>{readableFileSize(fontFile.size)} <ArrowRightOutlined /> {readableFileSize(minifyFont.size)}</div>
              <Divider type="vertical" />
              <div>{((minifyFont.size / fontFile.size) * 100).toFixed(2)}</div>
            </Space> :
            <Space><div>如果不在裁剪后的字体文件中，则会一行文字中出现不同字体</div></Space>
          }
          <Space>
            <Button type="primary" onClick={handleClick} icon={<ScissorOutlined />}>裁剪</Button>
          </Space>
        </Flex>

        {
          minifyFont.fileName && <Space direction='vertical' style={{ marginTop: '15px', width: '100%' }}>
            <FileCard name={minifyFont.fileName} size={minifyFont.size} type="font/ttf" url={minifyFont.url} />
          </Space>
        }
      </div>
    </div>
  )
}