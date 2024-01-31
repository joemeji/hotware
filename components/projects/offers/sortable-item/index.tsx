type SortableItemProps = {
  id?: any
  type?: any
  disabled?: any
  className?: any
  children?: React.ReactNode
}

export default function SortableItem(props: SortableItemProps) {
  return <div>{props.children}</div>;
  // const {
  //   attributes,
  //   listeners,
  //   setNodeRef,
  //   transform,
  //   transition,
  // } = useSortable({id: props.id, data: { type: props.type }, disabled: props.disabled });
  
  // const style = {
  //   transform: CSS.Translate.toString(transform),
  //   transition,
  // };

  // return (
  //   <>
  //     <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={props.className}>
  //       {props.children}
  //     </div>
  //   </>
  // );
}