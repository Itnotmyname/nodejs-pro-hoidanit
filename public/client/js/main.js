(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity ,tăng giảm sản phẩm 
    // $('.quantity button').on('click', function () {
    //     var button = $(this);
    //     var oldValue = button.parent().parent().find('input').val();
    //     if (button.hasClass('btn-plus')) {
    //         var newVal = parseFloat(oldValue) + 1;
    //     } else {
    //         if (oldValue > 0) {
    //             var newVal = parseFloat(oldValue) - 1;
    //         } else {
    //             newVal = 0;
    //         }
    //     }
    //     button.parent().parent().find('input').val(newVal);
    // });
    $('.quantity button').on('click', function () { //quantity được tìm đến và sau đó jQuery tìm đến button trg html rồi lắng nghe sự kiện on click
        let change = 0;

        var button = $(this);
        var oldValue = button.parent().parent().find('input').val(); //Phần này thì nên xem bài 136 từ phút 11:34 trở đi mới hiểu được
        if (button.hasClass('btn-plus')) { //Nếu nhấn vào dấu trừ (hoặc khi nhấn vào nút có "btn-plus") thì thực hiện if
            var newVal = parseFloat(oldValue) + 1;
            change = 1;//Logic này là nếu giá trị là dương thì change=1
        } else { //Nếu nhấn vào dấu trừ (hoặc khi nhấn vào nút có "btn-minus") thì thực hiện else
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
                change = -1;//logic này là để số không âm vì oldValue đã lớn hơn 1 rồi 
            } else { //Này dùng cho trường hợp oldValue <= 1 
                newVal = 1;//Thì cho newVal =1 thay vì trừ đến lúc bằng 0
            }//newVal chính là giá trị mới của imput đó 
        }
        const input = button.parent().parent().find('input');
        input.val(newVal); //Trước đó là lấy giá trị còn đây là xét giá trị

        //get price
        const price = input.attr("data-cart-detail-price"); //input ở đây là ở html và nhớ xem bài 123 phút 14:10 .Sau đó lấy tới thuộc tính data-cart-detail-price.Tức là lấy ra giá tiền đó
        const id = input.attr("data-cart-detail-id");//Tiếp đến chúng ta cần lấy ra id vì để có thể biết chúng ta đang thao tác với row nào trên table của mySQL

        const priceElement = $(`p[data-cart-detail-id='${id}']`);//Xem bài 123 phút 15 ,trong $(`p[data-cart-detail-id='${id}']`); thì chữ p là thẻ <p></p> trong html và có thuộc tính data-cart-detail-id
        if (priceElement) {
            const newPrice = +price * newVal;//Tính toán giá trị tiền mới
            priceElement.text(formatCurrency(newPrice));//Đồng thời cập nhật cho giá trị p hay thao tác như thế này có nghĩa là dùng javascript xóa đi giá trị cũ (trong cart.ejs và dòng 121-122)
        }

        //update total cart price
        const totalPriceElement = $(`p[data-cart-total-price]`);//Xem bài 123 phút 15:40. Tượng tự như cách hiểu ở trên lúc này vì trong file cart.ejs có 2 cái thuộc tính mà mình đặt giống nhau: data-cart-total-price trong thẻ <p></p> của html

        if (totalPriceElement && totalPriceElement.length) {
            const currentTotal = totalPriceElement.first().attr("data-cart-total-price");//Cái này chính là lấy giá trị tiền cũ của bên cart.ejs cụ thể là dòng 145-146
            let newTotal = +currentTotal;
            if (change === 0) {
                newTotal = +currentTotal;//Nếu change=0 thì vẫn giống như trên 
            } else {
                newTotal = change * (+price) + (+currentTotal); //Nếu khác không thì thực hiện phép nhân với tiền luôn .Tổng của nó luôn đúng vì change thể hiện ở trên là cộng hay trừ dấu âm
            }

            //reset change
            change = 0; //Việc reset change để mỗi lần nhấn nút cộng hay trừ thì change lại về như ban đầu

            //update
            totalPriceElement?.each(function (index, element) {
                //update text ,bản chất là sử dụng vòng lặp cho 2 phần tử .Đầu tiên là cập nhật giá trị cho nó
                $(totalPriceElement[index]).text(formatCurrency(newTotal));

                //update data-attribute.Cái này là set lại giá trị cho nó 
                $(totalPriceElement[index]).attr("data-cart-total-price", newTotal);
            });
        }
    });

    function formatCurrency(value) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency', currency: 'VND'
        }).format(value) //Phần này chả khác gì phần VND của ejs chả qua viết ra ngoài cho gọn 
    }

})(jQuery); //Nhận dạng jQuery thông qua dấu $ 

