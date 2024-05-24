import { useEffect, useState } from 'react';
import RCTree from 'rc-tree';
import 'rc-tree/assets/index.css';
import { findNodeById, findPath, loop } from '../lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';

const ArticleTree = ({
  data,
  value,
  onChange,
  placeholder,
  onEdit,
  onDel,
}: {
  placeholder: string;
  data: any[];
  value?: string[];
  onChange?: (v: string[]) => void;
  onEdit?: any;
  onDel?: any;
}) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [s, setS] = useState('key1');
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

  console.log('------ndzy------', data, '------ndzy------');

  return (
    <Accordion type="single" collapsible className="w-full" value={s} onValueChange={(value) => setS(value)}>
      <AccordionItem value="key1">
        <AccordionTrigger>
          {innerValue.length > 0 ? (
            findNodeById(data, innerValue[0]) ? (
              <div className="flex items-center gap-4">
                {findPath(data, innerValue[0]).join(' / ')}
                {/* {findNodeById(data, innerValue[0])?.title} */}
                {onEdit && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit();
                    }}
                  >
                    编辑
                  </Button>
                )}

                {onDel && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onDel(findNodeById(data, innerValue[0]).id);
                    }}
                  >
                    删除
                  </Button>
                )}
              </div>
            ) : (
              placeholder
            )
          ) : (
            placeholder
          )}
        </AccordionTrigger>
        <AccordionContent>
          <RCTree
            virtual
            height={800}
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
