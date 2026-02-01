using System.Text.Json;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PdfGenerator;

class Program
{
    static void Main(string[] args)
    {
        QuestPDF.Settings.License = LicenseType.Community;

        if (args.Length < 2)
        {
            Console.WriteLine("Usage: dotnet run <input_json> <output_pdf>");
            return;
        }

        string inputPath = args[0];
        string outputPath = args[1];

        try
        {
            string jsonString = File.ReadAllText(inputPath);
            Console.WriteLine($"Read JSON from {inputPath}");
            var bookings = JsonSerializer.Deserialize<List<BookingReportData>>(jsonString);
            Console.WriteLine($"Deserialized {bookings?.Count ?? 0} bookings");

            if (bookings == null) bookings = new List<BookingReportData>();

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(11));

                    page.Header()
                        .Row(row =>
                        {
                            row.RelativeItem().Column(column =>
                            {
                                column.Item().Text("Car Rental System").SemiBold().FontSize(20).FontColor(Colors.Blue.Medium);
                                column.Item().Text("Bookings Report").FontSize(15);
                                column.Item().Text($"Generated: {DateTime.Now:yyyy-MM-dd HH:mm}");
                            });
                        });

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(30);
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(3);
                                columns.RelativeColumn(2);
                                columns.RelativeColumn(2);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Element(CellStyle).Text("ID");
                                header.Cell().Element(CellStyle).Text("User");
                                header.Cell().Element(CellStyle).Text("Vehicle");
                                header.Cell().Element(CellStyle).Text("Period");
                                header.Cell().Element(CellStyle).Text("Status");
                                header.Cell().Element(CellStyle).Text("Amount");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.DefaultTextStyle(x => x.SemiBold()).BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                                }
                            });

                            foreach (var booking in bookings)
                            {
                                table.Cell().Element(CellStyle).Text(booking.Id.ToString());
                                table.Cell().Element(CellStyle).Text(booking.UserEmail);
                                table.Cell().Element(CellStyle).Text(booking.VehicleModel);
                                table.Cell().Element(CellStyle).Text($"{booking.PickupDate:MM/dd} - {booking.ReturnDate:MM/dd}");
                                table.Cell().Element(CellStyle).Text(booking.Status);
                                table.Cell().Element(CellStyle).Text($"$ {booking.TotalAmount:F2}");

                                static IContainer CellStyle(IContainer container)
                                {
                                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                                }
                            }
                        });

                    page.Footer()
                        .AlignCenter()
                        .Text(x =>
                        {
                            x.Span("Page ");
                            x.CurrentPageNumber();
                        });
                });
            })
            .GeneratePdf(outputPath);
            
            Console.WriteLine($"PDF generated at {outputPath}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            Environment.Exit(1);
        }
    }
}

public class BookingReportData
{
    public int Id { get; set; }
    public string UserEmail { get; set; }
    public string VehicleModel { get; set; }
    public DateTime PickupDate { get; set; }
    public DateTime ReturnDate { get; set; }
    public double TotalAmount { get; set; }
    public string Status { get; set; }
}
