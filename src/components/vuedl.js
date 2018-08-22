export default {
  functional: true,
  props: {
    items: {
      type: Array,
      required: true
    },
    isOrdered: Boolean
  },
  render: function (createElement, context) {
    console.log(createElement, context)
    // function appropriateListComponent () {
    //   var items = context.props.items

    //   if (items.length === 0)           return EmptyList
    //   if (typeof items[0] === 'object') return TableList
    //   if (context.props.isOrdered)      return OrderedList

    //   return UnorderedList
    // }

    return createElement(
      'div',
      context.data,
      context.children
    )
  }
}
