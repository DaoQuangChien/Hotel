Frontend Code Review
===========

## Date: 14/04/2015
  - **Branch**: exchange-plan-controls
  - **Reviewed by**: an.nvt
  - **Status**: Open
  - **Fixed by**: quan.tran

### File: [source/views/blocks/header.jade](source/views/blocks/header.jade)
  - Issue 1 Structure

    - Using `header#header` for contain `<nav>`
    - Using [Navs](http://getbootstrap.com/components/#nav) component

### File: [source/views/plan-de-charge.jade](source/views/plan-de-charge.jade)
  - Issue 1 Structure

    - Using `.chart-block` instead of `.chart--block` and replay for all blocks
    - No need `.row .col-*` if that block full screen
    - Form elements must `name` attribute
    - Form elements must define mixin
    - Using text `Abc` and `uppercase` property instead of text `ABC`
    - Don't use `.content-block`. `.content` and `.block` are same level
