/**
 * @防抖
 * **/
export function debounce(fn, wait) {
    let timeout: any = null
    return function(this: any) {
        let context = this,
            args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(function() {
            fn.call(context, args)
        }, wait)
    }
}