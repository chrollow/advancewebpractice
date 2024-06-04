$(document).ready(function () {
    fetchCustomers();

    $("#customerSubmit").on('click', function (e) {
        e.preventDefault();
        submitCustomerForm();
    });

    $("#customerUpdate").on('click', function (e) {
        e.preventDefault();
        updateCustomerForm();
    });

    $('#customerModal').on('show.bs.modal', function(e) {
        $("#cform").trigger("reset");
        $('#customerId').remove();
        const id = $(e.relatedTarget).data('id');
        if (id) {
            $('<input>').attr({type: 'hidden', id:'customerId', name: 'customer_id', value: id}).appendTo('#cform');
            fetchCustomer(id);
        }
    });

    $('#ctable tbody').on('click', 'a.deletebtn', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        deleteCustomer(id);
    });
});

function fetchCustomers() {
    $.ajax({
        type: "GET",
        url: "/api/customers",
        dataType: 'json',
        success: function (data) {
            console.log(data);
            const tbody = $("#cbody");
            tbody.empty();
            data.forEach(function (value) {
                const img = `<img src="/${value.img_path}" width='200px' height='200px'/>`;
                const tr = $("<tr>");
                tr.append($("<td>").text(value.id));
                tr.append($("<td>").html(img));
                tr.append($("<td>").text(value.username));
                tr.append($("<td>").text(value.address));
                tr.append($("<td>").text(value.contact_number));
                tr.append(`<td align='center'><a href='#' data-toggle='modal' data-target='#customerModal' id='editbtn' data-id="${value.id}"><i class='fas fa-edit' aria-hidden='true' style='font-size:24px; color:blue'></i></a></td>`);
                tr.append(`<td><a href='#' class='deletebtn' data-id="${value.id}"><i class='fa fa-trash' style='font-size:24px; color:red'></i></a></td>`);
                tbody.append(tr);
            });
        },
        error: function () {
            console.error('AJAX load did not work');
            alert("Error fetching customers.");
        }
    });
}

function submitCustomerForm() {
    const form = $('#cform')[0];
    const formData = new FormData(form);

    $.ajax({
        type: "POST",
        url: "/api/customers",
        data: formData,
        contentType: false,
        processData: false,
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        dataType: "json",
        success: function (data) {
            console.log(data);
            $("#customerModal").modal("hide");
            fetchCustomers();
            $('#cform').trigger("reset");
        },
        error: function (error) {
            console.error(error);
            alert("Error creating customer.");
        }
    });
}

function fetchCustomer(id) {
    $.ajax({
        type: "GET",
        url: `/api/customers/${id}`,
        success: function(data) {
            $("#customerId").val(data.id);
            $("#lname").val(data.username.split(' ')[1]);
            $("#fname").val(data.username.split(' ')[0]);
            $("#address").val(data.address);
            $("#phone").val(data.contact_number);
            $("#email").val(data.user.email);
            $("#cform").append(`<img src="${data.img_path}" width='200px' height='200px' />`);
        },
        error: function() {
            console.error('AJAX load did not work');
            alert("Error fetching customer details.");
        }
    });
}

function updateCustomerForm() {
    const id = $('#customerId').val();
    const form = $('#cform')[0];
    const formData = new FormData(form);
    formData.append('_method', 'PUT');

    $.ajax({
        type: "POST",
        url: `/api/customers/${id}`,
        data: formData,
        contentType: false,
        processData: false,
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
        dataType: "json",
        success: function (data) {
            console.log(data);
            $('#customerModal').modal('hide');
            fetchCustomers();
        },
        error: function (error) {
            console.error(error);
            alert("Error updating customer.");
        }
    });
}

function deleteCustomer(id) {
    bootbox.confirm({
        message: "Do you want to delete this customer?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    type: "DELETE",
                    url: `/api/customers/${id}`,
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    dataType: "json",
                    success: function (data) {
                        console.log(data);
                        fetchCustomers();
                        bootbox.alert(data.success);
                    },
                    error: function (error) {
                        console.error(error);
                        alert("Error deleting customer.");
                    }
                });
            }
        }
    });
}
