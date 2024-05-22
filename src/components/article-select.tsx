import { useEffect, useState } from 'react';
import RCTree from 'rc-tree';
import 'rc-tree/assets/index.css';
import { findNodeById, loop } from '../lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const ArticleTree = ({
  data,
  value,
  onChange,
  placeholder,
}: {
  placeholder: string;
  data: any[];
  value?: string[];
  onChange?: (v: string[]) => void;
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [s, setS] = useState('');
  const [innerValue, setInnerValue] = useState(value || []);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  useEffect(() => {
    if (value) {
      setInnerValue(value);
    }
  }, [value]);

  return (
    <Accordion type="single" collapsible className="w-full" value={s} onValueChange={(value) => setS(value)}>
      <AccordionItem value="key1">
        <AccordionTrigger>
          {innerValue.length > 0 ? findNodeById(data, innerValue[0])?.title || placeholder : placeholder}
        </AccordionTrigger>
        <AccordionContent>
          <RCTree
            showLine
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            treeData={loop(data)}
            selectedKeys={innerValue}
            onSelect={(keys: any) => {
              setInnerValue(keys);
              setS('');
              onChange && onChange(keys || []);
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ArticleTree;
